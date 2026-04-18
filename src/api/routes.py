from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)
CORS(api)


@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or "email" not in data or "password" not in data:
        return jsonify({"msg": "Email y password requeridos"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    hashed_password = generate_password_hash(data["password"])
    new_user = User(email=data["email"],
                    password=hashed_password, is_active=True)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado con éxito"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    # El identity puede ser el ID o el Email
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user": user.serialize()}), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"msg": f"Hola {user.email}, estás en el área privada"}), 200
