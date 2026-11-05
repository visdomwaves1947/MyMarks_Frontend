// The home page reviews as they were written by hand. The site shows them until the reviews load,
// if the API is down, and until the admin saves on the Website Pages > Home Page tab. Same as the backend default.
const review = (name, role, text) => ({ name, role, text, badge: 'Topper', visible: true });

export const DEFAULT_REVIEWS = {
  heading: 'What Our Students Say',
  subheading: 'Thousands of intermediate students score top marks in AP & Telangana board exams using our learning system.',
  items: [
    review('K. Sai Varun', '1st Year Board Topper', 'The chapter breakdowns and concept maps are lifesavers. I scored 99 out of 100 in my first-year boards. The timed tests gave me great confidence!'),
    review('Ananya Sharma', '2nd Year Student', 'The explanations and formula guides make tough concepts so easy to memorize. The dashboard progress bars kept me disciplined.'),
    review('Prof. K. Satyanarayana', 'Senior Board Paper Evaluator', 'As an instructor, I recommend this portal to all my students. The comprehensive syllabus coverage and solved question banks are perfect for intermediate students.'),
    review('P. Srinivas Rao', '1st Year Topper (99/100)', 'The solved previous board papers from 2021-2026 are incredibly accurate. Practicing mock exams helped me complete my actual paper early!'),
    review('M. Venkat Reddy', '2nd Year Topper (99/100)', 'Crucial concepts and long questions are explained with clear diagrams and notes. The chapter classes helped me get a state rank.'),
    review('T. Lakshmi Prasanna', '1st Year Student (98/100)', 'I was very nervous about solving equations and numerical problems, but the simple tricks and interactive quizzes made it my favorite subject!'),
    review('G. Chandra Shekar', 'Parent of Student', "I was worried about my son's board presentation. The board writing tips and handwriting presentation guides changed his score from 75 to 99!"),
    review('B. Rama Devi', '2nd Year Topper (99/100)', 'The 5-day masterclass revision plan is a lifesaver. It structures your study hours perfectly and covered exactly what came in the exams.'),
    review('K. Rajesh Kumar', '1st Year Student (99/100)', 'MyMarks is the ultimate platform for intermediate students. Extremely clean interface and the faculty response to doubts is very fast.'),
    review('S. Gayatri Devi', '2nd Year Student (99/100)', 'Thanks to the Expected Long Questions predicted on the platform, I was able to score full marks without any exam stress.'),
  ],
};
