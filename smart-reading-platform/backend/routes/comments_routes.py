from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models.comments import Comment
from ..extensions import db
from datetime import datetime

comments_routes = Blueprint('comments', __name__)

@comments_routes.route('/comments/<book_id>', methods=['GET'])
def get_comments(book_id):
    comments = Comment.query.filter_by(book_id=book_id).all()
    return jsonify([
        {
            'id': comment.id,
            'user_id': comment.user_id,
            'name': comment.user.name,
            'comment': comment.comment,
            'liked': comment.liked,
            'date': comment.date.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for comment in comments
    ])

@comments_routes.route('/comments', methods=['POST'])
def add_comment():
    data = request.get_json()

    user_id = data.get('user_id')
    book_id = data.get('book_id')
    comment_text = data.get('comment')
    liked = data.get('liked', False)

    if not user_id or not book_id or not comment_text:
        return jsonify({'message': 'Missing required fields'}), 400

    new_comment = Comment(
        user_id=user_id,
        book_id=book_id,
        comment=comment_text,
        liked=liked,
        date=datetime.utcnow()
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment added successfully', 'comment': new_comment.to_dict()}), 201


@comments_routes.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    current_user_id = get_jwt_identity()

    comment = Comment.query.get(comment_id)

    if not comment:
        return jsonify({"msg": "Comment not found"}), 404

    if comment.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"msg": "Comment deleted"}), 200
