import { FAQ_ITEMS } from '@/lib/structured-data';
import { GlassCard } from '@/components/ui/card';

export function Faq() {
  return (
    <section id="faq" className="py-20 px-5" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <h2
          id="faq-heading"
          className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-center text-[#1d1d1f] mb-4"
        >
          Frequently asked questions
        </h2>
        <p className="text-center text-[#6e6e73] text-lg mb-12">
          Quick answers about privacy, banks, pricing, and accuracy.
        </p>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <GlassCard key={item.question} padding="lg">
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
                {item.question}
              </h3>
              <p className="text-[#6e6e73] leading-relaxed">{item.answer}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
