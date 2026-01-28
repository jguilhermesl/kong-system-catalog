import React from 'react';
import SubscriptionCard from './SubscriptionCard';
import { Carousel } from './ui/carousel';
import type { Game } from '../models/Game';

interface SubscriptionsSectionProps {
  onAuthRequired?: () => void;
}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = () => {
  // Mock dos produtos de assinatura PlayStation Plus
  const subscriptions = [
    {
      id: 'ps-plus-6-months',
      title: 'PlayStation Plus',
      duration: '6 meses',
      cashPrice: '179,99',
      installmentPrice: '35',
      installments: '6x',
      savings: 'R$ 260,80',
      imageUrl: '/src/assets/ps-plus.png',
      game: {
        id: 'ps-plus-6',
        game: 'PlayStation Plus - 6 Meses',
        gameVersion: 'Assinatura',
        category: 'Serviços',
        primaryValue: '179.99',
        secondaryValue: '179.99',
        imageLink: '/src/assets/ps-plus.png',
        inPromo: false,
        unmissable: false,
        status: 'new',
      } as Game,
    },
    {
      id: 'ps-plus-12-months',
      title: 'PlayStation Plus',
      duration: '12 meses',
      cashPrice: '289,99',
      installmentPrice: '28,90',
      installments: '12x',
      savings: 'R$ 402,90',
      imageUrl: '/src/assets/ps-plus.png',
      game: {
        id: 'ps-plus-12',
        game: 'PlayStation Plus - 12 Meses',
        gameVersion: 'Assinatura',
        category: 'Serviços',
        primaryValue: '289.99',
        secondaryValue: '289.99',
        imageLink: '/src/assets/ps-plus.png',
        inPromo: false,
        unmissable: true,
        status: 'new',
      } as Game,
    },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          <span className="text-primary">ASSINATURAS</span>
        </h2>
      </div>

      {/* Listagem em grid para telas menores que xl */}
      <div className="block xl:hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-4">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            title={subscription.title}
            duration={subscription.duration}
            cashPrice={subscription.cashPrice}
            installmentPrice={subscription.installmentPrice}
            installments={subscription.installments}
            savings={subscription.savings}
            imageUrl={subscription.imageUrl}
            game={subscription.game}
          />
        ))}
      </div>

      {/* Carrossel para telas xl e maiores */}
      <div className="hidden xl:block">
        <Carousel classNameItem="max-w-[300px] my-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              title={subscription.title}
              duration={subscription.duration}
              cashPrice={subscription.cashPrice}
              installmentPrice={subscription.installmentPrice}
              installments={subscription.installments}
              savings={subscription.savings}
              imageUrl={subscription.imageUrl}
              game={subscription.game}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default SubscriptionsSection;
