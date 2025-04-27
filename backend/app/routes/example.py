from flask import Blueprint, jsonify

example_bp = Blueprint('example_bp', __name__)

@example_bp.route('/example', methods=['GET'])
def get_example():
    return jsonify({"message": "This is an example response!"})
