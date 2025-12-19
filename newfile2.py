import streamlit as st
 
st.title("final fdp")
 
age=st.slider("select the age" , 1 , 100)
city =st.selectbox("choose your city" ,["delhi" , "mumbai" , "jammu"]  )
 
if st.button("show details"):
    st.write("age" , age)
    st.write("city" , city)
