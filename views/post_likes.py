from flask import Response, request
from flask_restful import Resource
from models import LikePost, Post, db
from tests.utils import get_authorized_user_ids
import json

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()
        # print(body)
        try:
            post_id = int(body.get('post_id'))
        except:
            return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=400)
        if not post_id: return Response(json.dumps({"message": "post id is required"}), mimetype="application/json", status=400)
        post = Post.query.get(post_id)
        if not post: return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)
        if post.user_id not in get_authorized_user_ids(self.current_user.id): return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)

        try:
            new_like = LikePost(
                user_id = self.current_user.id,
                post_id = post_id
            )
            db.session.add(new_like)
            db.session.commit()
        except:
            return Response(json.dumps({"message": "like already exists"}), mimetype="application/json", status=400)

        return Response(json.dumps(new_like.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_post" where "id"=id
        # print(id)
        like = LikePost.query.get(id)
        if not like: return Response(json.dumps({"message": "like id is invalid"}), mimetype="application/json", status=404)
        if like.user_id != self.current_user.id: return Response(json.dumps({"message": "like id is invalid"}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
