"""Copilote Bac S — interface locale Qwen3 (Ollama)."""
import os
import requests
import streamlit as st

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
MODEL = os.environ.get("OLLAMA_MODEL", "qwen3:1.7b")
SUBJECTS = ["Mathématiques", "Physique", "Chimie", "SVT", "Philosophie"]
MODES = ["Expliquer le cours", "Indice progressif", "Corriger pas à pas", "Quiz", "Exercice similaire", "Bac blanc"]

st.set_page_config(page_title="Copilote Bac S Djibouti", page_icon="🎓")
st.title("🎓 Copilote Bac Terminale S — Djibouti")
st.caption("Assistant local expérimental — vérifiez les réponses avec les supports CRIPEN/MENFOP.")
subject = st.selectbox("Matière", SUBJECTS)
mode = st.selectbox("Mode pédagogique", MODES)
if "history" not in st.session_state:
    st.session_state.history = []
if st.button("Nouvelle conversation"):
    st.session_state.history = []
    st.rerun()

system = (
    "Tu es un tuteur de Terminale S à Djibouti. Réponds en français clair. "
    "Matière : " + subject + ". Mode : " + mode + ". "
    "Respecte les documents officiels fournis par l'élève lorsqu'ils existent; "
    "ne prétends pas connaître un document non fourni. "
    "Pour les corrections, explique chaque étape et vérifie les calculs. "
    "En mode indice, donne d'abord un seul indice sans révéler la réponse. "
    "Pour les quiz, pose une question à la fois et attends la réponse. "
    "Pour le bac blanc, propose des exercices originaux, sans prétendre reproduire un sujet officiel. "
    "Si tu es incertain, indique-le. N'invente ni barème officiel ni référence CRIPEN."
)
for msg in st.session_state.history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
question = st.chat_input("Pose ta question ou colle un exercice…")
if question:
    st.session_state.history.append({"role": "user", "content": question})
    with st.chat_message("user"):
        st.markdown(question)
    messages = [{"role": "system", "content": system}] + st.session_state.history[-12:]
    with st.chat_message("assistant"):
        try:
            response = requests.post(
                f"{OLLAMA_URL}/api/chat",
                json={"model": MODEL, "messages": messages, "stream": False,
                      "options": {"temperature": 0.3}},
                timeout=240,
            )
            response.raise_for_status()
            answer = response.json()["message"]["content"]
        except requests.RequestException as exc:
            st.error("Connexion Ollama impossible. Lancez Ollama et téléchargez le modèle.")
            st.code(f"ollama pull {MODEL}")
            st.caption(str(exc))
        else:
            st.markdown(answer)
            st.session_state.history.append({"role": "assistant", "content": answer})
st.info("Les échanges sont envoyés uniquement à l'adresse Ollama configurée. Par défaut : 127.0.0.1. Aucun document scolaire n'est intégré automatiquement.")
