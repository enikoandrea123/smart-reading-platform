import pytest
from ..app import create_app
from ..extensions import db
from unittest.mock import patch

@pytest.fixture
def app():
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_signup(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 201
    assert "token" in response.json
    assert response.json['message'] == "User registered successfully"

    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
    })
    assert response.status_code == 400
    assert response.json["message"] == "All fields are required"

    client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    response = client.post('/signup', json={
        "name": "Another User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 409
    assert response.json["message"] == "Email already in use"

def test_signin(client):
    client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })

    response = client.post('/signin', json={
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "token" in response.json
    assert response.json['message'] == "Login successful"

    response = client.post('/signin', json={
        "email": "testuser@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json["message"] == "Invalid credentials"

def test_profile(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    token = response.json['token']

    response = client.get('/profile', headers={
        'Authorization': f'Bearer {token}'
    })
    assert response.status_code == 200
    assert response.json['user']['name'] == "Test User"
    assert response.json['user']['email'] == "testuser@example.com"

    response = client.get('/profile')
    assert response.status_code == 401

def test_change_password(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    token = response.json['token']

    response = client.post('/change-password', json={
        "current_password": "password123",
        "new_password": "newpassword456"
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert response.json['message'] == "Password changed successfully"

    response = client.post('/change-password', json={
        "current_password": "wrongpassword",
        "new_password": "newpassword456"
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 401
    assert response.json['message'] == "Incorrect current password"

def test_delete_account(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    token = response.json['token']

    response = client.post('/delete-account', json={
        "current_password": "password123"
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert response.json['message'] == "Account deleted successfully"

    response = client.post('/delete-account', json={
        "current_password": "wrongpassword"
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 401
    assert response.json['message'] == "Incorrect current password"


@patch("backend.extensions.db.session.commit", side_effect=Exception("DB error"))
def test_signup_db_failure(mock_db_commit, client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })

    assert response.status_code == 500
    assert response.json["message"] == "Error registering user"
    assert "error" in response.json

@patch("backend.extensions.db.session.commit")
def test_signup_success(mock_db_commit, client):
    mock_db_commit.return_value = None

    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })

    assert response.status_code == 201, f"Signup failed: {response.json}"
    assert "token" in response.json, "Token not returned in response"
    assert "refresh_token" in response.json, "Refresh token not returned in response"
    assert response.json["message"] == "User registered successfully"

def test_signin_user_not_found(client):
    response = client.post('/signin', json={
        "email": "nonexistent@example.com",
        "password": "password123"
    })
    assert response.status_code == 401
    assert response.json["message"] == "Invalid credentials"

def test_change_password_missing_fields(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    token = response.json["token"]

    response = client.post('/change-password', json={
        "new_password": "newpassword456"
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 400
    assert response.json["message"] == "Current password and new password are required"


def test_change_password_db_failure(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 201, f"Signup failed: {response.json}"

    token = response.json.get("token")

    with patch("backend.extensions.db.session.commit", side_effect=Exception("DB error")):
        response = client.post('/change-password', json={
            "current_password": "password123",
            "new_password": "newpassword456"
        }, headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 500
    assert response.json["message"] == "Error updating password"
    assert "error" in response.json

def test_delete_account_missing_fields(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    token = response.json["token"]

    response = client.post('/delete-account', json={}, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 400
    assert response.json["message"] == "Current password is required"

def test_delete_account_db_failure(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 201, f"Signup failed: {response.json}"

    token = response.json.get("token")

    with patch("backend.extensions.db.session.commit", side_effect=Exception("DB error")):
        response = client.post('/delete-account', json={
            "current_password": "password123"
        }, headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 500
    assert response.json["message"] == "Error deleting account"
    assert "error" in response.json

def test_refresh_valid(client):
    response = client.post('/signup', json={
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123"
    })
    refresh_token = response.json["refresh_token"]

    response = client.post('/refresh', headers={'Authorization': f'Bearer {refresh_token}'})
    assert response.status_code == 200
    assert "token" in response.json

def test_refresh_missing_token(client):
    response = client.post('/refresh')
    assert response.status_code == 401