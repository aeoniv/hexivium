import random
import networkx as nx
import plotly.graph_objects as go
import streamlit as st
import numpy as np
import json
from asking import Asking
#import app as ap
#from streamlit.state.session_state import SessionState
import time

class IChingHexagram:
    def __init__(self, dataset):
        self.dataset = dataset
        self.click_count = st.session_state.get('click_count', 0)
        #self.middle_hexagram = st.session_state.middle_hexagram if 'middle_hexagram' in st.session_state else []
        self.middle_hexagram = st.session_state.get('middle_hexagram', [])
        self.left_hexagram = []
        self.right_hexagram = []
        self.changing_lines_info = {}
        self.user_question = st.session_state.get('user_question', "")
        self.coins = []
        self.toss_results = []
        self.fig = go.Figure()



    def toss_coins(self):
        coins = sum(random.choice([2, 3]) for _ in range(3))
        return coins
        
    def generate_traditional_hexagram(self):
        return [self.toss_coins() for _ in range(6)][::-1]  
    

    def derive_binary_hexagrams(self):
        left_hexagram = []
        right_hexagram = []
        for line in self.middle_hexagram:
            if line == 9:
                left_hexagram.append(1)
                right_hexagram.append(0)
            elif line == 8:
                left_hexagram.append(0)
                right_hexagram.append(0)
            elif line == 7:
                left_hexagram.append(1)
                right_hexagram.append(1)
            elif line == 6:
                left_hexagram.append(0)
                right_hexagram.append(1)
        return left_hexagram, right_hexagram

    def get_hexagram_key(self, hexagram):
        return ''.join(str(x) for x in hexagram)

    def interpret_changing_lines(self):
        #self.derive_binary_hexagrams()
        
        left_key = self.get_hexagram_key(self.left_hexagram)
        right_key = self.get_hexagram_key(self.right_hexagram)

        print("Left key:", left_key)  # Add this line to debug


        left_hexagram_data = self.dataset.get(left_key, {'lines': [''] * 6})
        right_hexagram_data = self.dataset.get(right_key, {'lines': [''] * 6})

        self.changing_lines_info = {
            'left_hexagram': {
                'code':left_key,
                'name': left_hexagram_data['name'],
                'number': left_hexagram_data['number'],
                'changing_lines': [''] * len(self.middle_hexagram)
            },
            'right_hexagram': {
                'code':right_key,
                'name': right_hexagram_data['name'],
                'number': right_hexagram_data['number'],
                'changing_lines': [''] * len(self.middle_hexagram)
            }
        }

        for i, line in enumerate(self.middle_hexagram):
            if line == 6:
                self.changing_lines_info['left_hexagram']['changing_lines'][i] = left_hexagram_data['lines'][i]
            elif line == 9:
                self.changing_lines_info['right_hexagram']['changing_lines'][i] = right_hexagram_data['lines'][i]
        return self.changing_lines_info
    



    def render_hexagrams(self):
        self.interpret_changing_lines()

        col1, col2, col3 = st.columns(3)

        animation_css = """
        <style>
        .fade-in {
            animation: fadeIn 1s;
        }
        @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
        }
        </style>
        """

        with col1:
            if self.click_count == 6:
                st.markdown(f"### **Inner Hexagram**")
                st.markdown(f"**Name:** `{self.changing_lines_info['left_hexagram']['name']}`")
                st.markdown(f"**Number:** `{self.changing_lines_info['left_hexagram']['number']}`", unsafe_allow_html=True)
            for i in range(self.click_count):
                index = 6 - i - 1
                line = self.left_hexagram[index]
                data = self.dataset[self.get_hexagram_key(self.left_hexagram)]['lines'][index]
                st.markdown(f"**Line {i+1}:** {line}, *{data}*", unsafe_allow_html=True)

        # Column 2: Changing Hexagram
        with col2:
            st.markdown(f"### **Changing Hexagram**")
            st.markdown(''':blue-background[Hypergram]''')
            st.markdown(''':blue[synchronicity]''')
            if not self.middle_hexagram:
                st.markdown("`No data in middle_hexagram`", unsafe_allow_html=True)
            for i in range(self.click_count):
                index = 6 - i - 1
                line = self.middle_hexagram[index]
                changing_line_info = self.changing_lines_info['left_hexagram']['changing_lines'][index] if line == 6 else \
                                    self.changing_lines_info['right_hexagram']['changing_lines'][index] if line == 9 else \
                                    ""
                st.markdown(f"**Line {i+1}:** {line} - *{changing_line_info}*", unsafe_allow_html=True)

        # Column 3: Outer Hexagram
        with col3:
            if self.click_count == 6:
                st.markdown(f"### **Outer Hexagram**")
                st.markdown(f"**Name:** `{self.changing_lines_info['right_hexagram']['name']}`")
                st.markdown(f"**Number:** `{self.changing_lines_info['right_hexagram']['number']}`", unsafe_allow_html=True)
            for i in range(self.click_count):
                index = 6 - i - 1
                line = self.right_hexagram[index]
                data = self.dataset[self.get_hexagram_key(self.right_hexagram)]['lines'][index]
                st.markdown(f"**Line {i+1}:** {line}, *{data}*", unsafe_allow_html=True)


    def print_hexagrams(self):
        self.interpret_changing_lines()
        for i in range(6):
            print(f"{self.left_hexagram[i]}\t{self.middle_hexagram[i]}\t{self.right_hexagram[i]}")
        #print("Changing lines:", self.interpret_changing_lines())    
        print("left_hexagram:")
        #print(self.changing_lines_info['left_hexagram']['code'])
        print(f"Name: {self.changing_lines_info['left_hexagram']['name']}, Number: {self.changing_lines_info['left_hexagram']['number']}")
        print("Changing lines:", self.changing_lines_info['left_hexagram']['changing_lines'])

        print("Right Hexagram:")
        #print(self.changing_lines_info['right_hexagram']['code'])
        print(f"Name: {self.changing_lines_info['right_hexagram']['name']}, Number: {self.changing_lines_info['right_hexagram']['number']}")
        print("Changing lines:", self.changing_lines_info['right_hexagram']['changing_lines'])

        return self.changing_lines_info['left_hexagram']['code'], self.changing_lines_info['right_hexagram']['code']
    
    def display_hexagrams(self):
        self.print_hexagrams()

        left_hexagram = self.left_hexagram
        right_hexagram = self.right_hexagram
        left_hexagram_data = self.dataset[self.get_hexagram_key(left_hexagram)]
        right_hexagram_data = self.dataset[self.get_hexagram_key(right_hexagram)]

        st.header("Left Hexagram")
        self.draw_hexagram(left_hexagram, left_hexagram_data, 'left')

        st.header("Right Hexagram")
        self.draw_hexagram(right_hexagram, right_hexagram_data, 'right')

    def click_button(self):
        if self.click_count < 6:
            self.click_count += 1
            self.middle_hexagram.append(self.toss_coins())
            self.left_hexagram, self.right_hexagram = self.derive_binary_hexagrams()
            st.session_state.click_count = self.click_count
            st.session_state.middle_hexagram = self.middle_hexagram


   

        else:
            element_to_display = st.empty()
            with st.spinner('Wait for it...'):
                st.info('Wait for the oracle to process the information', icon="ℹ️")
                element_to_display.info("New content")
                element_to_display.warning("Old content")
                self.render_hexagrams()
                st.session_state['buttons_locked'] = False


 
    def hexagram_to_query(self, changing_lines_info):
        query_parts = []
 
        
        name_left = changing_lines_info['left_hexagram']['name']
        number_left = changing_lines_info['left_hexagram']['number']
        lines_left = changing_lines_info['left_hexagram']['changing_lines']

        name_right = changing_lines_info['right_hexagram']['name']
        number_right = changing_lines_info['right_hexagram']['number']
        lines_right = changing_lines_info['right_hexagram']['changing_lines']

        query_parts.append(f"inner state of awareness: {name_left}, body hexagram number: {number_left}, line change related to advice to transition foward to the external state of awareness: {lines_left}, outer state of awareness: {name_right}, environment hexagram number {number_right}, line change related to advice to transition back to the internal state of awareness:{lines_right},")

        
        #print("asking", query_parts)
        return "AND".join(query_parts)
    
    def set_user_question(self, question):
        self.user_question = question
        st.session_state.user_question = question
