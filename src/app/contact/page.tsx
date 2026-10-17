import B2BForm from '@/components/B2BForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-black mb-10 border-l-8 border-scir-pink pl-6 text-white">Оставить заявку</h1>
      
      {/* Подсказка для пользователя */}
      <p className="text-2xl text-gray-200 mb-8 font-medium">
        Заполните форму ниже, и мы свяжемся с вами для обсуждения пилота.
      </p>

      <B2BForm />
    </main>
  );
}
