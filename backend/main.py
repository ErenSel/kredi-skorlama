from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import predict_credit_risk

app = FastAPI(title="Kredi Skorlama API")

# Next.js frontend'in erişebilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreditInput(BaseModel):
    checking_account: str
    duration: int
    credit_history: str
    purpose: str
    credit_amount: int
    savings_account: str
    employment_since: str
    installment_rate: int
    personal_status_sex: str
    other_debtors: str
    property: str
    age: int
    other_installments: str
    housing: str
    existing_credits: int
    job: str

@app.get("/")
def root():
    return {"message": "Kredi Skorlama API çalışıyor!"}

@app.post("/predict")
def predict(data: CreditInput):
    input_dict = data.model_dump()
    result = predict_credit_risk(input_dict)
    return result