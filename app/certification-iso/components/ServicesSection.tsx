// app/certification-iso/components/ServicesSection.tsx
"use client";

import { useState } from "react";

const services = [
  {
    title: "Conseil & accompagnement",
    content: (
      <>
        <p>
          Le conseil et l’accompagnement sont deux postures complémentaires
          permettant l’une d’arborer la solution la plus adaptée à vos enjeux et
          l’autre, d’assurer sa mise en œuvre et l’appropriation de cette
          solution au sein de vos équipes.
        </p>
        <p className="mt-6">
          En fonction de vos prérogatives, nos consultants vous apporteront leur
          expertise sur la mise en place de votre système et vous guideront tout
          au long du processus selon la démarche <strong>PCDA</strong> (Plan,
          Do, Check, Act) :{" "}
          <strong>
            vous serez alors prêts pour décrocher en toute sérénité la
            certification ISO pour votre organisation.
          </strong>
        </p>
        <p className="mt-6">
          Pour cela, nous nous assurerons de la conformité du système de
          management aux exigences de la norme, de sensibiliser l’ensemble des
          collaborateurs aux enjeux du système et à la nécessité de leur
          implication, sans oublier de former les acteurs clés afin de maintenir
          le système dans une démarche d’amélioration continue.
        </p>
      </>
    ),
  },
  {
    title: "Diagnostic & évaluation",
    content: (
      <>
        <p>
          Avant d’engager toute démarche d’implémentation d’une norme ISO,{" "}
          <strong>CACEG Consulting</strong> vous propose de réaliser un
          diagnostic préalable pour évaluer le niveau de maturité de votre
          société et analyser l’écart entre votre situation réelle et la
          situation visée.
        </p>
        <p className="mt-6">
          A travers une analyse documentaire et des entretiens individuels et
          collectifs, nos experts récolteront l’ensemble des informations
          nécessaires pour dresser leur analyse, déterminer les risques et
          opportunités de l’organisation, établir un plan d’actions et les
          ressources associées pour la mise en place du système de management.
        </p>
        <p className="mt-6">
          Ce diagnostic initial vous permettra d’engager dans de bonnes
          conditions l’implémentation de la norme et d’assurer la réussite du
          projet.
        </p>
      </>
    ),
  },
  {
    title: "Audit interne & audit à blanc",
    content: (
      <>
        <p>
          Une des exigences des normes ISO, l’<strong>audit interne</strong>,
          doit être réalisé annuellement et avant tout audit de certification
          pour évaluer l’efficacité et l’efficience du système de management. Il
          est un des piliers de la démarche d’amélioration continue.
        </p>
        <p className="mt-6">
          En fonction de la taille de votre entreprise et des ressources
          disponibles, l’audit interne pourra être effectué par un organisme
          externe. Les experts de <strong>CACEG Consulting</strong> pourront
          intervenir sur ce volet-ci et vous accompagner dans le suivi et la
          mise en place de leurs préconisations.
        </p>
        <p className="mt-6">
          Contrairement à l’audit interne qui peut être réalisé sur une partie
          du système, l’<strong>audit à blanc</strong> quant à lui est réalisé
          dans les conditions d’audit de certification, sur tout le système. Il
          s’agit d’un examen à blanc qui vous permettra, le cas échéant
          d’apporter les mesures correctives nécessaires avant le passage de
          l’audit de certification le jour J. L’audit à blanc n’est pas exigé
          par l'ISO mais il est fortement recommandé car il vous permettra de
          passer votre audit de certification en toute confiance, vous assurant
          de satisfaire à chacune des exigences de la norme et donc de gagner du
          temps et de l’argent.
        </p>
        <p className="mt-6">
          Quel que soit le type d’audit à réaliser,{" "}
          <strong>CACEG Consulting</strong> s’engage à vous soumettre ses
          recommandations relatives au maintien et à la mise en conformité de
          votre système tout en respectant et en favorisant l’atteinte de vos
          objectifs.
        </p>
      </>
    ),
  },
  {
    title: "Suivi & externalisation",
    content: (
      <>
        <p>
          Une fois la certification obtenue, il a régulièrement été observé un
          relâchement au niveau des exercices de contrôle ou de surveillance du
          système de management. Pour éviter toute perte de conformité et pour
          dégager du temps à vos opérationnels,{" "}
          <strong>CACEG Consulting</strong> vous propose plusieurs niveaux
          d’assistance.
        </p>
        <p className="mt-6">
          Nous pouvons apporter notre support de manière ponctuelle ou
          périodique à vos « équipes ISO » (Responsables Qualité, QSE ou SSI…)
          afin de faire vivre le système de management en toute conformité et le
          maintenir à un niveau d’engagement optimal. Ainsi pourrez-vous aborder
          les audits annuels de suivi et les audits de revouvellement (chaque 3
          ans) en toute tranquillité et garder un système performant.
        </p>
      </>
    ),
  },
];

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
          Nos Services
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-5xl mx-auto mb-16">
          <strong>
            Au service de l’amélioration des performances de votre organisation,
            CACEG Consulting vous propose une offre complète de services afin de
            s’intégrer parfaitement à vos objectifs et à votre stratégie de mise
            en œuvre d’une démarche de certification ISO.
          </strong>
        </p>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-8 py-4 rounded-lg font-bold transition ${
                  activeTab === index
                    ? "bg-yellow-500 text-blue-900"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>
          <div className="bg-white p-10 rounded-xl shadow-lg text-lg text-gray-700 leading-relaxed space-y-6">
            {services[activeTab].content}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
                className={`w-full px-6 py-5 text-left font-bold transition flex justify-between items-center ${
                  activeTab === index
                    ? "text-blue-900 bg-yellow-100"
                    : "text-gray-700"
                }`}
              >
                {service.title}
                <span className="text-yellow-500 text-2xl">
                  {activeTab === index ? "−" : "+"}
                </span>
              </button>
              {activeTab === index && (
                <div className="px-6 pb-6 pt-4 text-gray-700 leading-relaxed space-y-6">
                  {service.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
