# 📝 WriteDreams

**WriteDreams** is a minimalistic web app that allows anyone to share a creative idea with the world — no registration required. The goal is to inspire others by sharing ideas that could become apps, books, films, or anything imaginable.

## 🌟 How it works

- 📤 A user can **submit only one idea every 24 hours**.
- ⏱️ After submitting, a **24-hour countdown** is triggered, during which the user cannot submit another idea.
- 🧾 After writing, a menu appears with the following options:
  - 🔍 Browse previously submitted ideas (only those that have received votes).
  - 👍 Vote for other people's ideas to highlight them.

> ⚠️ Ideas without any votes (unrated) are not shown publicly. This behavior may evolve over time.

## 🎯 Goal

To create a space where people can freely share ideas that might inspire others and potentially change the world.

## 💡 Technical inspiration

- 🖋️ Interface styled after **Notion**: clean, clear, paper-like design.
- 🧩 Icons and components: **Material UI**.
- 💾 The countdown uses a system similar to how [idraw](https://idraw.co/) stores drawings: leveraging **localStorage** to persist state without requiring user accounts.

## 🛠️ Tech stack (initial)

- `Vite` + `React`
- `Material UI` for the UI
- `localStorage` for countdown timer and state
- Future backend: TBD (likely Firebase, Supabase, or similar)

## 🚧 Project status

In development 🚀  
Pull requests, issues, and suggestions are welcome!

---
