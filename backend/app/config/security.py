from cryptography.fernet import Fernet
from app.config.email import ENCRYPTION_KEY

from passlib.context import CryptContext

try:
    cipher = Fernet(ENCRYPTION_KEY.encode()) if ENCRYPTION_KEY else None
except (TypeError, ValueError) as exc:
    raise RuntimeError(
        "ENCRYPTION_KEY is invalid. Generate a Fernet key with "
        "`python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"` "
        "and replace the value in your backend .env file."
    ) from exc


def encrypt(text: str) -> str:
    if cipher is None:
        raise RuntimeError("ENCRYPTION_KEY is required to save SMTP credentials")
    return cipher.encrypt(text.encode()).decode()


def decrypt(text: str) -> str:
    if cipher is None:
        raise RuntimeError("ENCRYPTION_KEY is required to read SMTP credentials")
    return cipher.decrypt(text.encode()).decode()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12,
    deprecated="auto"
)

def hash_password(password: str):
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def hash_answer(answer: str):
    return pwd_context.hash(answer)


def verify_answer(plain, hashed):
    return pwd_context.verify(plain, hashed)
