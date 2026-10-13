from pydantic import BaseModel

class PGUpload(BaseModel):
    name : str
    address : str 
    total_rooms : int