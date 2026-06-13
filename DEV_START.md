# Daily Dev Commands

## One-time setup

`backend/.venv` already exists. Just install the dependencies into it:

```bash
cd backend
.venv/bin/pip install -r requirements.txt
cd ..
```

If you ever need to recreate the venv from scratch:
```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cd ..
```

---

## Every day

| What | Command |
|------|---------|
| Start everything | `npm run dev` |
| Backend only | `npm run dev:backend` |
| Expo only | `npm run dev:mobile` |

- `npm run dev` starts backend + Expo together. Press **Ctrl+C** once to stop both.
- Backend runs on **http://localhost:8000**
- Expo runs on **http://localhost:8081** (scan QR with Expo Go)

---

## Troubleshooting

**"backend/.venv not found"** → run the one-time setup above.

**Backend port already in use:**
```bash
lsof -ti :8000 | xargs kill -9
```

**Reset Expo cache:**
```bash
npx expo start --clear
```
