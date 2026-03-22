from flask import Flask, render_template

app = Flask(__name__)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/publications')
def publications():
    publications = [
        {
            "title": "Few-Shot Learning in Vision-Language Models: A Survey",
            "authors": "Vidisha Deshpande, Advait Mehendale, Gauri Shelke, Rupesh Jaiswal, Opal Raut",
            "year": "2026",
            "venue": "CVR 2025",
            "type": "Conference Paper",
            "abstract": "This survey traces the evolution of vision-language models from early manual features to modern architectures like CLIP and Flamingo. It evaluates state-of-the-art performance in cross-modal tasks such as VQA and image captioning. Finally, it analyzes key challenges in computational efficiency and explores future directions for few-shot learning deployment.",
            "link": "https://link.springer.com/chapter/10.1007/978-3-032-14044-9_10"
        },
    ]
    return render_template('publications.html', publications=publications)

@app.route('/')
def home():
    projects = [
        {
            "title": "Review Sentiment Analysis",
            "tech": "Python, NLP, Scikit-learn",
            "desc": "Classified user sentiment using NLP pipelines and Fl-score analysis.",
            "link": "https://github.com/ADVD-M/Review_Sentiment"
        },
        {
            "title": "Investigate App",
            "tech": "Python, Streamlit, API",
            "desc": "Built a web-based data investigation tool for real-time filtering.",
            "link": "https://github.com/ADVD-M/Investigate-App"
        },
        {
            "title": "Coffee Shop Sales",
            "tech": "SQL, Power BI, ETL",
            "desc": "Analyzed retail transactions to identify growth opportunities.",
            "link": "https://github.com/ADVD-M/Coffee-Shop-Sales-Analysis"
        },
        {
            "title": "My Portfolio Website",
            "tech": "Python, Flask, HTML, CSS",
            "desc": "A simple yet elegant portfolio website for showcasing my projects.",
            "link": "https://github.com/ADVD-M/My-Portfolio"
        },
        {
            "title": "Student Burnout Prediction App",
            "tech": "Python, Streamlit, ML",
            "desc": "Predicts student burnout using a feedback form, along with a built-in chatbot.",
            "link": "https://github.com/ADVD-M/student-burnout-app"
        }
    ]

    return render_template('index.html', projects=projects)

if __name__ == '__main__':
    app.run(debug=True)
