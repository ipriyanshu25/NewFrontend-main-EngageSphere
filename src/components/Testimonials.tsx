import React from 'react';
import GlassContainer from './GlassContainer';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#000e1f] via-[#001e3c] to-[#001730] font-sans text-white overflow-hidden relative">
      {/* Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            
          </h2>
          <p className="text-lg md:text-xl font-medium leading-relaxed text-yellow-100">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about our services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlassContainer
              key={index}
              className="
                h-full
                p-6
                bg-[#1f1f1f]
                border border-white/10
                rounded-3xl
                hover:scale-[1.03]
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <div className="flex flex-col h-full text-white">
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="mb-6 flex-grow italic text-base md:text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Client Name & Role */}
                <div className="mt-auto">
                  <p className="text-xl font-bold mb-1 leading-tight">
                    {testimonial.name}
                  </p>
                  <p className="text-sm">{testimonial.role}</p>
                </div>
              </div>
            </GlassContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
