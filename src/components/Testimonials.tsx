import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Michael T.",
    role: "Member since 2023",
    content: "I've tried 4 different handicapping services before finding this one. The transparency and actual ROI here are unmatched. Up 15 units this NFL season alone.",
    rating: 5,
    avatar: "M"
  },
  {
    id: 2,
    name: "Sarah J.",
    role: "VIP Member",
    content: "What I love most is the bankroll management advice. They don't just throw picks at you; they teach you how to bet sustainably. Best investment I've made for my sports viewing.",
    rating: 5,
    avatar: "S"
  },
  {
    id: 3,
    name: "David K.",
    role: "Member since 2024",
    content: "The Discord community is incredible. Getting live updates and seeing everyone cash together makes the games so much more exciting. Highly recommend to anyone on the fence.",
    rating: 5,
    avatar: "D"
  }
];

export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <h2>Don't Just Take <span className="text-gradient">Our Word</span> For It</h2>
          <p>Join thousands of members who are transforming how they bet on sports.</p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div className="testimonial-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <span className="author-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
