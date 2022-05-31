from flask import Response, request
from flask_restful import Resource
import json
from models import comment, db, Comment, Post
from tests.utils import get_authorized_user_ids
import flask_jwt_extended

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        # print(body)
        if not body.get('text'): return Response(json.dumps({"message": "comment text is required"}), mimetype="application/json", status=400)

        post_id = body.get('post_id')
        if not post_id: return Response(json.dumps({"message": "post id is required"}), mimetype="application/json", status=400)
        if not isinstance(post_id, int): return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=400)
        post = Post.query.get(post_id)
        if not post: return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)
        if post.user_id not in get_authorized_user_ids(self.current_user.id): return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)

        new_comment = Comment(
            text = body.get('text'),
            user_id = self.current_user.id,
            post_id = post_id
        )
        db.session.add(new_comment)
        db.session.commit()

        return Response(json.dumps(new_comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "Comment" record where "id"=id
        # print(id)
        comment = Comment.query.get(id)
        if not comment: return Response(json.dumps({"message": "post id id={0} is invalid"}), mimetype="application/json", status=404)
        if comment.user_id != self.current_user.id: return Response(json.dumps({"message": "post id id={0} is invalid"}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
