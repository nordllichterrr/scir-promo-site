import B2BForm from '@/components/B2BForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-black mb-12 border-l-8 border-scir-pink pl-6 text-white">Оставить заявку</h1>
      <B2BForm />
    </main>
  );
}
