"use client";
import { useState } from "react";

const API_URL = "https://kredi-skorlama-api.onrender.com/predict";

const formOptions = {
  checking_account: [
    { label: "Hesap Yok", value: "A14" },
    { label: "0 DM'den Az", value: "A11" },
    { label: "0 – 200 DM", value: "A12" },
    { label: "200 DM ve Üzeri", value: "A13" },
  ],
  credit_history: [
    { label: "Hiç kredi alınmadı / tümü zamanında ödendi", value: "A30" },
    { label: "Bu bankadaki tüm krediler zamanında ödendi", value: "A31" },
    { label: "Mevcut krediler zamanında ödeniyor", value: "A32" },
    { label: "Geçmişte gecikmeler yaşandı", value: "A33" },
    { label: "Kritik hesap / başka bankalarda sorunlu kredi", value: "A34" },
  ],
  purpose: [
    { label: "Otomobil (Yeni)", value: "A40" },
    { label: "Otomobil (İkinci El)", value: "A41" },
    { label: "Mobilya / Ekipman", value: "A42" },
    { label: "Radyo / TV", value: "A43" },
    { label: "Beyaz Eşya", value: "A44" },
    { label: "Tamirat", value: "A45" },
    { label: "Eğitim", value: "A46" },
    { label: "İş", value: "A49" },
    { label: "Diğer", value: "A410" },
  ],
  savings_account: [
    { label: "100 DM'den Az", value: "A61" },
    { label: "100 – 500 DM", value: "A62" },
    { label: "500 – 1000 DM", value: "A63" },
    { label: "1000 DM ve Üzeri", value: "A64" },
    { label: "Bilinmiyor / Tasarruf Yok", value: "A65" },
  ],
  employment_since: [
    { label: "İşsiz", value: "A71" },
    { label: "1 Yıldan Az", value: "A72" },
    { label: "1 – 4 Yıl", value: "A73" },
    { label: "4 – 7 Yıl", value: "A74" },
    { label: "7 Yıl ve Üzeri", value: "A75" },
  ],
  personal_status_sex: [
    { label: "Erkek – Bekar", value: "A93" },
    { label: "Erkek – Evli / Dul", value: "A94" },
    { label: "Erkek – Boşanmış / Ayrı", value: "A91" },
    { label: "Kadın – Evli / Boşanmış / Ayrı", value: "A92" },
    { label: "Kadın – Bekar", value: "A95" },
  ],
  other_debtors: [
    { label: "Yok", value: "A101" },
    { label: "Kefil", value: "A103" },
    { label: "Ortak Başvurucu", value: "A102" },
  ],
  property: [
    { label: "Gayrimenkul", value: "A121" },
    { label: "Birikim / Hayat Sigortası", value: "A122" },
    { label: "Otomobil / Diğer", value: "A123" },
    { label: "Bilinmiyor / Mülk Yok", value: "A124" },
  ],
  other_installments: [
    { label: "Yok", value: "A143" },
    { label: "Banka", value: "A141" },
    { label: "Mağaza", value: "A142" },
  ],
  housing: [
    { label: "Ev Sahibi", value: "A152" },
    { label: "Kiracı", value: "A151" },
    { label: "Ücretsiz Oturuyor", value: "A153" },
  ],
  job: [
    { label: "Yönetici / Yüksek Nitelikli", value: "A174" },
    { label: "Nitelikli İşçi", value: "A173" },
    { label: "Vasıfsız – Yerleşik", value: "A172" },
    { label: "Vasıfsız – Yerleşik Değil", value: "A171" },
  ],
};

type Result = {
  risk_score: number;
  decision: string;
  decision_tr: string;
  good_probability: number;
  bad_probability: number;
};

export default function Home() {
  const [screen, setScreen] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const [form, setForm] = useState({
    checking_account: "A14",
    duration: 24,
    credit_history: "A32",
    purpose: "A43",
    credit_amount: 3500,
    savings_account: "A65",
    employment_since: "A73",
    installment_rate: 2,
    personal_status_sex: "A93",
    other_debtors: "A101",
    property: "A121",
    age: 35,
    other_installments: "A143",
    housing: "A152",
    existing_credits: 1,
    job: "A173",
  });

  const set = (key: string, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
      setScreen("result");
    } catch {
      alert("API'ye bağlanılamadı. Backend çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  const Select = ({ field }: { field: keyof typeof formOptions }) => (
    <select
      value={form[field as keyof typeof form]}
      onChange={(e) => set(field, e.target.value)}
      className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
    >
      {formOptions[field].map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );

  const CardHeader = ({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) => (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
      <span className="text-sm font-semibold text-slate-800">{title}</span>
    </div>
  );

  const Label = ({ text }: { text: string }) => (
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{text}</span>
  );

  if (screen === "result" && result) {
    const isApprove = result.decision === "approve";
    const isReview = result.decision === "review";
    const isDecline = result.decision === "decline";

    const ringColor = isApprove ? "border-green-200" : isReview ? "border-yellow-200" : "border-red-200";
    const scoreColor = isApprove ? "text-green-600" : isReview ? "text-yellow-600" : "text-red-600";
    const pillBg = isApprove ? "bg-green-100 text-green-800" : isReview ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-slate-900 rounded-2xl overflow-hidden">
            <div className="px-7 py-4 border-b border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">Kredi Karnesi</div>
                <div className="text-xs text-slate-500">AI Destekli Risk Analizi</div>
              </div>
            </div>

            <div className="p-7">
              <div className="bg-white rounded-xl p-8 text-center mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Risk Skoru</p>
                <div className={`w-32 h-32 rounded-full border-8 ${ringColor} flex flex-col items-center justify-center mx-auto mb-5`}>
                  <span className={`text-5xl font-bold ${scoreColor} leading-none`}>{result.risk_score}</span>
                  <span className="text-xs text-slate-400 mt-1">/ 100</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ${pillBg}`}>
                  {isApprove && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                  {isReview && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                  {isDecline && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                  {result.decision_tr}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Olasılık Dağılımı</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">İyi Kredi Olasılığı</span>
                    <span className="font-bold text-green-600">%{result.good_probability}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.good_probability}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Kötü Kredi Olasılığı</span>
                    <span className="font-bold text-red-600">%{result.bad_probability}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${result.bad_probability}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Karar Kriterleri</p>
                {[
                  { label: "Risk Skoru < 30", badge: "Onay", cls: "bg-green-100 text-green-800" },
                  { label: "30 ≤ Risk < 60", badge: "İnceleme", cls: "bg-yellow-100 text-yellow-800" },
                  { label: "Risk Skoru ≥ 60", badge: "Red", cls: "bg-red-100 text-red-800" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-none">
                    <span className="text-xs text-slate-500">{r.label}</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${r.cls}`}>{r.badge}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setScreen("form"); setResult(null); }}
                className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Yeni Başvuru
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900 rounded-2xl overflow-hidden">
          <div className="px-7 py-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Kredi Skorlama Sistemi</div>
              <div className="text-xs text-slate-500">AI Destekli Risk Analizi</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-slate-500">Canlı</span>
            </div>
          </div>

          <div className="bg-slate-100 p-6 grid grid-cols-[1fr_340px] gap-5">
            <div className="flex flex-col gap-4">

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <CardHeader
                  color="bg-blue-50"
                  title="Müşteri Bilgileri"
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                />
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Yaş" />
                      <input type="number" min={19} max={75} value={form.age}
                        onChange={(e) => set("age", Number(e.target.value))}
                        className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Cinsiyet & Medeni Hal" />
                      <Select field="personal_status_sex" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Konut Durumu" />
                      <Select field="housing" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Meslek" />
                      <Select field="job" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <CardHeader
                  color="bg-green-50"
                  title="Finansal Bilgiler"
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                />
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Vadesiz Hesap" />
                      <Select field="checking_account" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Tasarruf Hesabı" />
                      <Select field="savings_account" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Kredi Geçmişi" />
                      <Select field="credit_history" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="İstihdam Süresi" />
                      <Select field="employment_since" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <CardHeader
                  color="bg-purple-50"
                  title="Kredi Detayları"
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                />
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Kredi Miktarı (DM)" />
                      <input type="number" min={250} max={18424} value={form.credit_amount}
                        onChange={(e) => set("credit_amount", Number(e.target.value))}
                        className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Vade (Ay)" />
                      <input type="number" min={4} max={72} value={form.duration}
                        onChange={(e) => set("duration", Number(e.target.value))}
                        className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Taksit Oranı" />
                      <select value={form.installment_rate}
                        onChange={(e) => set("installment_rate", Number(e.target.value))}
                        className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        <option value={4}>%35 ve Üzeri</option>
                        <option value={3}>%25 – %35</option>
                        <option value={2}>%15 – %25</option>
                        <option value={1}>%15'ten Az</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Kredi Amacı" />
                      <Select field="purpose" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Mevcut Kredi" />
                      <select value={form.existing_credits}
                        onChange={(e) => set("existing_credits", Number(e.target.value))}
                        className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Diğer Borçlular" />
                      <Select field="other_debtors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label text="Mülkiyet" />
                      <Select field="property" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <div className="flex flex-col gap-1.5">
                      <Label text="Diğer Taksit Planları" />
                      <Select field="other_installments" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">Risk Skoru</p>
                <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-slate-300 leading-none">—</span>
                </div>
                <p className="text-xs text-slate-400">Formu doldurup analiz edin</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Olasılık Dağılımı</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">İyi Kredi Olasılığı</span>
                    <span className="font-bold text-slate-300">—</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Kötü Kredi Olasılığı</span>
                    <span className="font-bold text-slate-300">—</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Karar Kriterleri</p>
                {[
                  { label: "Risk Skoru < 30", badge: "Onay", cls: "bg-green-100 text-green-800" },
                  { label: "30 ≤ Risk < 60", badge: "İnceleme", cls: "bg-yellow-100 text-yellow-800" },
                  { label: "Risk Skoru ≥ 60", badge: "Red", cls: "bg-red-100 text-red-800" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-none">
                    <span className="text-xs text-slate-500">{r.label}</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${r.cls}`}>{r.badge}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Analiz ediliyor..." : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Kredi Riskini Analiz Et
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}