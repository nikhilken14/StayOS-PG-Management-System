from pydantic import BaseModel


class SignUpRequest(BaseModel):
    username: str
    email: str
    password: str
    security_question: str
    security_answer: str


class LoginRequest(BaseModel):
    username: str
    password: str


class ForgotPasswordRequest(BaseModel):
    username: str


class ResetPasswordRequest(BaseModel):
    username: str
    security_answer: str
    new_password: str


class DeleteAdminRequest(BaseModel):
    username: str
    password : str
    confirm: str   

class SMTPConfigRequest(BaseModel):
    sender_email: str
    app_password: str