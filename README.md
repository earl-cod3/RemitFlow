# 🌍 RemitFlow - Cross-Border Payment Simulator

RemitFlow is a full-stack fintech sandbox designed to simulate real-world international money transfers.  
It models the **complete financial flow** used by remittance, banking, and payment systems:

**FX Quoting → Compliance Scoring → Ledger Updates → Transaction History → Transfer Details**

This project demonstrates practical fintech engineering patterns and is ideal for:
- learning payments architecture,
- showcasing full-stack competence,
- simulating cross-border transactions,
- experimenting with FX logic and wallet ledgers.

---

## 🎯 Purpose of the Project

RemitFlow was built to replicate the **core mechanics of a remittance platform** without dealing with real money.  
It allows engineers and learners to understand:

- how FX conversions work,
- how wallets and balances update atomically,
- how compliance engines assess risk,
- how transaction histories are logged and retrieved,
- how frontend + backend synchronize state.

**The purpose is to provide a safe playground for fintech logic — realistic, typed, and production-like.**

---

## 📦 What the Project Covers

### **✔ FX Engine**
- Rate calculation  
- Converted amount  
- Transfer fees  
- Total debit logic  

### **✔ Compliance Engine**
- Scoring from 0–100  
- PASS / REVIEW / REJECT  
- Automatic transfer rejection when rules fail  

### **✔ Wallet System**
- Multi-currency wallets  
- Automatic wallet creation  
- Balance debit and credit under a database transaction  

### **✔ Transfer Lifecycle**
- Create transfer  
- Calculate FX  
- Run compliance  
- Debit sender wallet  
- Credit recipient wallet  
- Mark transfer as COMPLETED  
- Expose full transaction history  

### **✔ Frontend Dashboard**
- Transfer list  
- Transfer details  
- Polished dark mode UI  
- Fully responsive fintech interface  

---

## 🧭 Project Aim

The aim of RemitFlow is to showcase **production-grade fintech architecture** in a simple, understandable way:

> **“A realistic sandbox that demonstrates how modern remittance and payment engines work end-to-end.”**

---

## 🧰 Tech Stack

### **Backend**
- **NestJS** — Modular service architecture  
- **Prisma ORM** — Type-safe DB queries  
- **PostgreSQL** — Transactional ledger  
- **Typescript**  
- **FX Service + Compliance Service**  
- **Prisma Transactions** (atomic debits & credits)

### **Frontend**
- **Next.js 16** (App Router, React Server Components)  
- **React 19**  
- **Tailwind CSS v4**  
- **Dark Mode Theming**  
- **Typed API Client**  
- **Fintech-style UI Components**

### **Infrastructure**
- **Docker / Docker Compose**  
- Optional: **Render**, **Railway**, **Vercel**

---

## 🖥️ Screenshots

### **🏡 Dashboard (Home)**  
[Download full resolution](https://drive.google.com/file/d/1UihO8CYpV_TzbuqMEBUBenCqKKkoUi8Z/view?usp=drive_link)

[<img src="https://drive.google.com/uc?export=view&id=1UihO8CYpV_TzbuqMEBUBenCqKKkoUi8Z" width="800"/>](https://drive.google.com/file/d/1UihO8CYpV_TzbuqMEBUBenCqKKkoUi8Z/view?usp=drive_link)

---

### **📄 Transfers Page**  
[Download full resolution](https://drive.google.com/file/d/1pa8hFX59boHAw1gvRNaUrjaCimvwpSAv/view?usp=drive_link)

[<img src="https://drive.google.com/uc?export=view&id=1pa8hFX59boHAw1gvRNaUrjaCimvwpSAv" width="800"/>](https://drive.google.com/file/d/1pa8hFX59boHAw1gvRNaUrjaCimvwpSAv/view?usp=drive_link)

---

### **🔍 Transfer Details**  
[Download full resolution](https://drive.google.com/file/d/11XRqjch88UI7p714oQnk7X2yKQH-x4RJ/view?usp=drive_link)

[<img src="https://drive.google.com/uc?export=view&id=11XRqjch88UI7p714oQnk7X2yKQH-x4RJ" width="800"/>](https://drive.google.com/file/d/11XRqjch88UI7p714oQnk7X2yKQH-x4RJ/view?usp=drive_link)

---

## 🐳 Running with Docker

### **1. Clone the repo**
```bash

cd remitflow
