from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from tests import utils

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        follows = Following.query.filter_by(user_id=self.current_user.id).all()
        return Response(json.dumps([follow.to_dict_following() for follow in follows]), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        to_follow_id = body.get('user_id')
        if not to_follow_id: return Response(json.dumps({"message": "following id is required"}), mimetype="application/json", status=400)

        # check if user_id is an integer
        if not isinstance(to_follow_id, int): return Response(json.dumps({"message": "following id must be an integer"}), mimetype="application/json", status=400)

        # check if the user exists in the database
        to_follow = User.query.get(to_follow_id)
        if not to_follow: return Response(json.dumps({"message": "user user_id={0} not found"}), mimetype="application/json", status=404)
        
        # check if the user is already following
        if to_follow_id in utils.get_following_ids(self.current_user.id): return Response(json.dumps({"message": "already following this user"}), mimetype="application/json", status=400)

        new_following = Following(
            user_id = self.current_user.id,
            following_id = to_follow_id
        )
        db.session.add(new_following)
        db.session.commit()

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        if not isinstance(id, int): return Response(json.dumps({"message": "id must be integer"}), mimetype="application/json", status=400)

        to_unfollow = Following.query.get(id)
        if not to_unfollow: return Response(json.dumps({"message": "user user_id={0} not found"}), mimetype="application/json", status=404)

        if to_unfollow.user_id != self.current_user.id: return Response(json.dumps({"message": "user user_id={0} not found"}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
