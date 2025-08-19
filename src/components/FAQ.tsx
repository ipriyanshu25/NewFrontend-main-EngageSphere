import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import GlassContainer from './GlassContainer';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#000e1f] via-[#001e3c] to-[#001730] text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-extrabold mb-4 tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="text-lg">
            Got questions? We've got answers. If not, reach out to our team anytime.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          <GlassContainer className="divide-y divide-white/10 bg-[#111111] border border-[#00264D]/60 rounded-3xl">
            {items.map((item, index) => (
              <div key={index} className="py-5 px-6 transition-all">
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full text-left focus:outline-none group"
                  aria-expanded={openIndex === index}
                >
                  <h3
                    className={`text-lg font-semibold transition-colors ${
                      openIndex === index ? 'text-white' : 'text-white group-hover:text-white'
                    }`}
                  >
                    {item.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="mt-4 text-white leading-relaxed animate-fadeIn">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </GlassContainer>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
