import streamlit as st
import os
from dotenv import load_dotenv
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser
from langchain.vectorstores import Vectara

load_dotenv()


class Asking:
    def __init__(self):                

        self.CUSTOMER_ID = os.getenv("CUSTOMER_ID")
        self.API_KEY = os.getenv("API_KEY")
        self.CORPUS_ID = int(os.getenv("CORPUS_ID", 6))  
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        

        print(f"CUSTOMER_ID: {self.CUSTOMER_ID}")
        print(f"API_KEY: {self.API_KEY}")
        print(f"CORPUS_ID: {self.CORPUS_ID}")
        print(f"OPENAI_API_KEY: {self.OPENAI_API_KEY}")
        self.vectara_client = self.initialize_vectara()
   
    def initialize_vectara(self):
        vectara = Vectara(
            vectara_customer_id=self.CUSTOMER_ID,
            vectara_corpus_id=self.CORPUS_ID,
            vectara_api_key=self.API_KEY
        )
        return vectara
    
    #def get_knowledge_content(self, query, threshold=0.5):
    #    found_docs = self.vectara_client.similarity_search_with_score(
    #        query,
    #        score_threshold=threshold,
    #    )
    #    knowledge_content = ""
    #    for number, (score, doc) in enumerate(found_docs):
    #        knowledge_content += f"Document {number}: {found_docs[number][0].page_content}\n"
    #    return knowledge_content
    
    def get_knowledge_content(self, query, threshold=0.5):
        found_docs = self.vectara_client.similarity_search_with_score(
            query,
            score_threshold=threshold,
        )
        knowledge_content = ""
        for number, (score, doc) in enumerate(found_docs):
            knowledge_content += f"Document {number}: {found_docs[number][0].page_content}\n"
        return knowledge_content

    def get_knowledge_content00(self, query, threshold=0.5):
        try:
            found_docs = self.vectara_client.similarity_search_with_score(
                query,
                score_threshold=threshold,
            )
            knowledge_content = ""
            if found_docs:  # Check if there are documents found
                for number, item in enumerate(found_docs):
                    if isinstance(item, tuple) and len(item) >= 2:  # Check if it's a tuple and has at least two elements
                        score, doc = item
                        knowledge_content += f"Document {number}: {doc.page_content}\n"
                    else:
                        print(f"Unexpected item format: {item}")
            else:
                return "No documents found matching your query."

            return knowledge_content
        except Exception as e:
            print(f"An error occurred during Vectara query: {e}")
            return "An error occurred during Vectara query."

    
    """    
    def get_knowledge_content(self, query, threshold=0.5):
        try:
            found_docs = self.vectara_client.similarity_search_with_score(
                query,
                score_threshold=threshold,
            )
        except Exception as e:
            print(f"An error occurred during Vectara query: {e}")
            return "An error occurred during Vectara query."

        knowledge_content = ""
        for item in found_docs:
            if isinstance(item, tuple) and len(item) == 2:
                score, doc = item
                knowledge_content += f"Document {found_docs.index(item)}: {doc.page_content}\n"
            else:
                print(f"Unexpected format in found_docs: {item}")

        if not knowledge_content:
            knowledge_content = "No documents found."

        return knowledge_content
    """
    def handle_user_query(self, user_input):
        # Fetch knowledge content based on user input
        knowledge_content = self.get_knowledge_content(user_input)
        response = self.generate_ai_response(knowledge_content, user_input)
        self.display_ai_response(response)

 
    
    def generate_ai_response(self, knowledge_content, user_input):
        prompt = self.create_interactive_prompt(knowledge_content, user_input)
        runnable = PromptTemplate.from_template(prompt) | ChatOpenAI(streaming=True, callbacks=[StreamingStdOutCallbackHandler()], openai_api_key=self.OPENAI_API_KEY) | StrOutputParser()
        return runnable.invoke({"knowledge": knowledge_content, "issue": user_input})

    def create_interactive_prompt(self, knowledge_content, user_input):
        detailed_queries = st.session_state.get('detailed_queries', {})

        #print("detailed_queries", detailed_queries)

        return f"""
           
            Act as an I-Ching oracle and provide life advice based on the user's question and the hexagram details.

            **User Question:**
            {user_input}

            **Hexagram Information:**
            {knowledge_content}

            **Instructions:**
            1. Interpret the user's question, if provided.
            2. Read the inner and the outer hexagram making a conetion with past and future.
            4. Link the inner hexagram the outer hexagram by interpreting the changging lines.
            5. Combine the user question with the Hexagrams and Lines to provide a history telling.
            6. Offer guidance on how the user can contemplate on their question and the i-ching's wisdom.
        """

        """        
        Variables: {detailed_queries.get("Variables", "")}
        Type: {detailed_queries.get("Type", "")}
        Strategy: {detailed_queries.get("Strategy", "")}
        Authority: {detailed_queries.get("Authority", "")}
        Signature: {detailed_queries.get("Signature", "")}
        NotSelfTheme: {detailed_queries.get("NotSelfTheme", "")}
        Definition: {detailed_queries.get("Definition", "")}
        Digestion: {detailed_queries.get("Digestion", "")}
        Sense: {detailed_queries.get("Sense", "")}
        Cognition: {detailed_queries.get("Cognition", "")}
        Environment: {detailed_queries.get("Environment", "")}
        profile: {detailed_queries.get("profile", "")}
        IncarnationCross: {detailed_queries.get("IncarnationCross", "")}
        Not-SelfTheme: {detailed_queries.get("Not-SelfTheme", "")}
        Motivation: {detailed_queries.get("Motivation", "")}
        Perspective: {detailed_queries.get("Perspective", "")}
        Centers: {detailed_queries.get("Centers", "")}
        Channels: {detailed_queries.get("Channels", "")}
        Planets: {detailed_queries.get("Planets", "")}
        Chemistry: {detailed_queries.get("Chemistry", "")}"""


    def display_ai_response(self, response):
        with st.chat_message("assistant"):
            st.write(response)
