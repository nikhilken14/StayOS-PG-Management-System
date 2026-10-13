from pydantic import BaseModel
from datetime import date

class ResidentCreate(BaseModel):
    full_name : str
    email : str
    mobile_no : str
    DOB : date
    permenant_address : str
    aadhar : str
    status : str

class ResidentUpdate(ResidentCreate):
    pass