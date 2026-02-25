from flask import Flask, render_template

app = Flask(__name__)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/publications')
def publications():
    publications = [
        # Add your publications below. Example:
        # {
        #     "title": "Paper Title Here",
        #     "authors": "Advait Mehendale, Co-Author Name",
        #     "year": "2024",
        #     "venue": "Conference / Journal Name",
        #     "type": "Conference Paper",
        #     "abstract": "A short description or abstract of the publication.",
        #     "link": "https://link-to-paper.com"
        # },
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
        }
    ]

    return render_template('index.html', projects=projects)

if __name__ == '__main__':
    app.run(debug=True)
