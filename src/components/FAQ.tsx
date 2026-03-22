import { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    id: 1,
    question: "How and when are picks sent out?",
    answer: "Picks are posted in our exclusive member area and sent via email/Discord notifications immediately after being finalized. We ensure you get them well before the games start to guarantee the best odds."
  },
  {
    id: 2,
    question: "Do you offer a guarantee?",
    answer: "While we cannot legally guarantee sports betting results due to the unpredictable nature of sports, we do guarantee transparency. Every pick, win or lose, is permanently tracked on our third-party verified record page."
  },
  {
    id: 3,
    question: "What is your average unit sizing?",
    answer: "We employ strict bankroll management to protect your capital. Our standard picks are 1U (unit) to 2U, with occasional max plays at 3-5U for extremely high-confidence edges. We recommend 1U = 1% of your total bankroll."
  },
  {
    id: 4,
    question: "Can I cancel at any time?",
    answer: "Yes! There are no long-term commitments required. You can manage your subscription and cancel directly from your profile dashboard settings with one click, before your next billing cycle."
  },
  {
    id: 5,
    question: "Which sports do you handicap?",
    answer: "Our team of analysts covers the NFL, NBA, MLB, NHL, College Football & Basketball, UFC, and major Soccer leagues (Premier League, Champions League, etc.). We focus entirely on data-driven edges."
  }
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq" id="faq">
      <div className="container faq__container">
        <div className="faq__header">
          <h2>Got Questions?</h2>
          <p>We've got answers to help you get started.</p>
        </div>

        <div className="faq__list">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`faq-item ${openId === faq.id ? 'is-open' : ''}`}
            >
              <button 
                className="faq-item__question"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={openId === faq.id}
              >
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div 
                className="faq-item__answer"
                style={{
                  maxHeight: openId === faq.id ? '200px' : '0'
                }}
              >
                <div className="answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
