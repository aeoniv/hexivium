
import json
import plotly.graph_objects as go
import streamlit as st
from dotenv import load_dotenv
from iching_hexagram import IChingHexagram
from asking import Asking


load_dotenv()

st.set_page_config(page_title="Hexivium", layout="wide")


def iching():

  
    go.Treemap(None, )

    st.markdown(f"### **I-CHING Oracle**")

    #nav_option = st.selectbox(
    #    "What you looking for?:",
    #    [None, "I-Ching", "Login / Sign Up"],
    #    key="_role",
    #    on_change=set_role,
    #)
    #menu() # Render the dynamic menu!

    with open('./data/hexagrams_lines.json', encoding='utf-8') as file:
        gates_data = json.load(file)


    #sidebar()
    
    # Initialize GraphManager with data
    #graph_manager = GraphManager(gates_data)
    #edge_index = graph_manager.get_edge_by_index(64)
    #print("edge_index", edge_index)

    #transition_manager = TransitionManager(graph_manager.graph)
    #transition_manager.deactivate_transitions(["Transition_111111-111110"])
    #transition_manager.activate_transitions(["Transition_111110-111111"])

    # Initialize TokenManager
    #token_manager = TokenManager(graph_manager.graph)
    #token_manager.add_token('111111')
    #token_manager.move_token("011111", "000000")

    #petri_manager = PetriNetManager(graph_manager.graph)
    #petri_manager.add_tokens('111111', 3)  # Add 3 tokens to gate_1
    #petri_manager.add_tokens('000000', 2)  # Add 2 tokens to gate_2

    #nav_option = st.sidebar.radio("Go to", ["I-Ching", "Login / Sign Up"])
    



    #if nav_option == "I-Ching":
    if "messages" not in st.session_state:
            st.session_state.messages = []

    # Display chat messages from history on app rerun
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Initialize IChingHexagram if it hasn't been initialized yet
    if 'iching_hexagram' not in st.session_state:
        st.session_state['iching_hexagram'] = IChingHexagram(gates_data)

    iching_hexagram = st.session_state['iching_hexagram']

    if 'buttons_locked' not in st.session_state:
        st.session_state['buttons_locked'] = True

    #if st.session_state['buttons_locked']:
    #    st.write("### Please sign up or log in to unlock the buttons.")
        #handle_signup()
        #handle_login()

    if st.button("Click here six times", disabled=st.session_state['iching_hexagram'].click_count >= 6, help="Click six times on this button to perform an action"):
        st.session_state['iching_hexagram'].click_button()

    
    #else:
    #    if user_input := st.chat_input("What do you have in Mind?", disabled=st.session_state['iching_hexagram'].click_count >= 6):
    #        st.success('Done!')         
    #        st.session_state.messages.append({"role": "user", "content": user_input})
    #        with st.chat_message("user"):
    #            st.markdown(user_input)
    #        st.session_state['iching_hexagram'].set_user_question(user_input)

    #    if st.button("click here six times", disabled=st.session_state['iching_hexagram'].click_count >= 6, help="Click six times on this button to perform an action"):
    #        st.markdown("<style>button { background-color: red; }</style>", unsafe_allow_html=True)
    #        st.session_state['iching_hexagram'].click_button()


        
        # Define dimensions and positions for drawing
        hex_size = 100  # Size of each hexagram line
        line_height = 20
        line_width = 100
        spacing = 30


        # Define the setup function for the p5.js sketch
        setup_js = f"""
        function setup() {{
            let canvas = createCanvas(windowWidth, windowHeight);
            canvas.position(0, 0);
            canvas.style('z-index', '-1');
            background(9, 108, 144);
            noLoop();
        }}
        """

        # Define the draw function for the p5.js sketch
        draw_js = f"""
        function draw() {{
            background(255);  // White background
            textSize(16);
            fill(0);  // Black color for text and shapes

            let x_left = width / 4;
            let x_mid = width / 2;
            let x_right = 3 * width / 4;
            let y_start = height - 50;  // Start drawing from the bottom

            // Draw left hexagram
            drawHexagram({st.session_state['iching_hexagram'].left_hexagram}, x_left, y_start, true);

            // Draw middle hexagram with changing lines
            drawHexagram({st.session_state['iching_hexagram'].middle_hexagram}, x_mid, y_start, false);

            // Draw right hexagram
            drawHexagram({st.session_state['iching_hexagram'].right_hexagram}, x_right, y_start, true);
        
        }}

        function drawHexagram(hexagram, x, y_start, isBinary) {{
            for (let i = 0; i < hexagram.length; i++) {{
                let y = y_start - i * {spacing};  // Calculate y position from bottom up
                if (isBinary) {{
                    if (hexagram[i] === 1) {{
                        // Yang line (full rectangle)
                        fill('black');
                        rect(x, y, {line_width}, {line_height});
                    }} else {{
                        // Yin line (two small rectangles)
                        fill('white');
                        rect(x, y, {line_width} / 2 - 5, {line_height});  // First half
                        rect(x + {line_width} / 2 + 5, y, {line_width} / 2 - 5, {line_height});  // Second half
                    }}
                }} else {{
                    // For the middle hexagram, display lines based on their traditional I Ching numbering
                    if (hexagram[i] === 9) {{
                        fill('gray');
                        rect(x, y, {line_width}, {line_height});
                        ellipse(x + {line_width} / 2, y + {line_height} / 2, 10, 10);  // Circle in the middle
                    }} else if (hexagram[i] === 8) {{
                        fill('gray');
                        rect(x, y, {line_width} / 2 - 5, {line_height});  // First half of yin line
                        rect(x + {line_width} / 2 + 5, y, {line_width} / 2 - 5, {line_height});  // Second half
                    }} else if (hexagram[i] === 7) {{
                        fill('gray');
                        rect(x, y, {line_width}, {line_height});
                    }} else if (hexagram[i] === 6) {{
                        fill('gray');
                        rect(x, y, {line_width} / 2 - 5, {line_height});  // Yin line with a break
                        rect(x + {line_width} / 2 + 5, y, {line_width} / 2 - 5, {line_height});
                        line(x, y + {line_height} / 2, x + {line_width}, y + {line_height} / 2);  // Cross line
                    }}
                }}
            }}
        }}
        """
        # Combine setup and draw functions into one HTML string with p5.js
        html_code = f"""
        <html>
        <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>


        </head>
        <body>
            <script>
                {setup_js}
                {draw_js}
            </script>
        </body>
        </html>
        """


        #with open("iching_hexagram_visualization.html", "w") as file:
        #    file.write(html_code)

        st.components.v1.html(html_code, height=400) #

    
#    if not st.session_state['buttons_locked', True]:
#        if user_input := st.chat_input("What do you have in Mind?"):
#            st.success('Done!')
#            st.session_state.messages.append({"role": "user", "content": user_input})
#            with st.chat_message("user"):
#                st.markdown(user_input)
#            st.session_state['iching_hexagram'].set_user_question(user_input)

#            ask = Asking()
#            changing_lines_info = st.session_state['iching_hexagram'].changing_lines_info
#            question = st.session_state['iching_hexagram'].hexagram_to_query(changing_lines_info) + " User Question: " + user_input
#            response = ask.handle_user_query(question)
#            st.write(response)

#            if st.button("Do you want to know more about yourself?"):
#                st.components.v1.iframe(
#                    "https://embed.bodygraphchart.com/v1/13934/iframe?token=0190b9df-2f0a-40aa-af2e-bd3ccde165f5",
#                    width=800,
#                    height=600
#                )

    iching_hexagram.render_hexagrams()
    
    if not st.session_state.get('buttons_locked', True):
        user_input = st.chat_input("What do you have in mind?")
        if user_input:
            st.session_state['iching_hexagram'].set_user_question(user_input)
            ask = Asking()
            hexagram_info = st.session_state['iching_hexagram'].get_hexagram_info()
            response = ask.handle_user_query(user_input, hexagram_info)
            
            # Append the question and response to session state
            if 'conversation' not in st.session_state:
                st.session_state['conversation'] = []
            st.session_state['conversation'].append({"role": "user", "content": user_input})
            st.session_state['conversation'].append({"role": "assistant", "content": response})

            # Display the conversation
            for message in st.session_state['conversation']:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])
#elif nav_option == "Login / Sign Up":
#    if st.session_state.get('buttons_locked', False):  
#        st.write("## Login / Sign Up")
#        handle_signup()
#        handle_login()
        

    #if st.session_state['logged_in']:
    #    st.session_state['buttons_locked'] = False
