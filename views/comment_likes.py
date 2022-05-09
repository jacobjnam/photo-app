from flask import Response, request
from flask_restful import Resource
from models import LikeComment, Comment, db
from tests.utils import get_authorized_user_ids
import json

class CommentLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_comment" based on the data posted in the body 
        body = request.get_json()
        # print(body)
        try:
            comment_id = int(body.get('comment_id'))
        except:
            return Response(json.dumps({"message": "invalid comment id"}), mimetype="application/json", status=400)
        if not comment_id: return Response(json.dumps({"message": "comment id is required"}), mimetype="application/json", status=400)
        comment = Comment.query.get(comment_id)
        if not comment: return Response(json.dumps({"message": "invalid comment id"}), mimetype="application/json", status=404)
        if comment.user_id not in get_authorized_user_ids(self.current_user.id): return Response(json.dumps({"message": "invalid comment id"}), mimetype="application/json", status=404)

        try:
            new_comment_like = LikeComment(
                user_id = self.current_user.id,
                comment_id = comment_id
            )
            db.session.add(new_comment_like)
            db.session.commit()
        except:
            return Response(json.dumps({"message": "like already exists"}), mimetype="application/json", status=400)

        return Response(json.dumps(new_comment_like.to_dict()), mimetype="application/json", status=201)

class CommentLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_comment" where "id"=id
        # print(id)
        like = LikeComment.query.get(id)
        if not like: return Response(json.dumps({"message": "comment_like id is invalid"}), mimetype="application/json", status=404)
        if like.user_id != self.current_user.id: return Response(json.dumps({"message": "comment_like id is invalid"}), mimetype="application/json", status=404)

        LikeComment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        CommentLikesListEndpoint, 
        '/api/comments/likes', 
        '/api/comments/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        CommentLikesDetailEndpoint, 
        '/api/comments/likes/<int:id>', 
        '/api/comments/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
