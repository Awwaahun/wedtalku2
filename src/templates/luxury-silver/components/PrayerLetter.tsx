import React, { useState } from 'react';
import { SilverHeart, SilverDiamond, SilverEnvelope } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface PrayerLetterProps {
  config: any;
}

const PrayerLetter: React.FC<PrayerLetterProps> = ({ config }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const groomName = config?.couple?.groom?.name || 'Alexander';
  const brideName = config?.couple?.bride?.name || 'Isabella';

  const fullLetter = `Kepada Yth.

Bapak/Ibu/Saudara/i

Assalamu'alaikum Warahmatullahi Wabarakatuh

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami:

${groomName}
Putra dari Bapak Robert & Ibu Elizabeth

dengan

${brideName}
Putri dari Bapak Michael & Ibu Sarah

Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

Acara akan dilaksanakan pada:

Hari, Tanggal : Sabtu, 15 Desember 2025
Akad Nikah   : 09:00 - 10:00 WIB
Resepsi      : 11:00 - 14:00 WIB
Tempat       : Ballroom Hotel Grand Palace
             Jl. Gatot Subroto No. 45, Jakarta Pusat

"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
(QS. Ar-Rum: 21)

Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

Atas kehadiran dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh

Hormat kami,

Keluarga Besar
${groomName} & ${brideName}`;

  const truncatedLetter = fullLetter.substring(0, 400) + '...';

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23C0C0C0' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverEnvelope size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Invitation Letter
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            A heartfelt invitation to celebrate our sacred union
          </p>
        </div>

        {/* Letter Display */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="card-silver bg-gradient-to-br from-ivory to-platinum/30 relative overflow-hidden">
            {/* Letter Header */}
            <div className="bg-silver-gradient p-6 text-center relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              <div className="flex justify-center mb-3">
                <div className="flex space-x-3">
                  <SilverDiamond size={24} className="text-white drop-shadow-lg" />
                  <SilverHeart size={28} className="text-white drop-shadow-lg" />
                  <SilverDiamond size={24} className="text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="font-script text-3xl text-white drop-shadow-lg">
                Undangan Pernikahan
              </h3>
              <p className="font-elegant text-white/90 mt-2">
                Wedding Invitation
              </p>
            </div>

            {/* Letter Content */}
            <div className="p-8 md:p-12">
              {/* Couple Names */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="text-center">
                    <p className="font-script text-3xl text-charcoal mb-2">{groomName}</p>
                    <p className="font-elegant text-silver text-sm">&</p>
                  </div>
                  <SilverHeart size={32} className="text-primary-silver" />
                  <div className="text-center">
                    <p className="font-script text-3xl text-charcoal mb-2">{brideName}</p>
                  </div>
                </div>
              </div>

              {/* Letter Text */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-6 relative">
                <div className="absolute top-2 left-2">
                  <SilverDiamond size={16} className="text-primary-silver opacity-50" />
                </div>
                <div className="absolute top-2 right-2">
                  <SilverDiamond size={16} className="text-primary-silver opacity-50" />
                </div>
                <div className="absolute bottom-2 left-2">
                  <SilverDiamond size={16} className="text-primary-silver opacity-50" />
                </div>
                <div className="absolute bottom-2 right-2">
                  <SilverDiamond size={16} className="text-primary-silver opacity-50" />
                </div>
                
                <pre className="font-body text-charcoal leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  {isExpanded ? fullLetter : truncatedLetter}
                </pre>
              </div>

              {/* Read More/Less Button */}
              <div className="text-center mb-6">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="btn-silver px-6 py-3 text-sm font-medium inline-flex items-center space-x-2"
                >
                  <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Signature Area */}
              <div className="border-t-2 border-silver-light pt-6">
                <div className="grid md:grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="mb-2 h-px bg-gradient-to-r from-transparent via-primary-silver to-transparent"></div>
                    <p className="font-elegant text-charcoal">{groomName}</p>
                    <p className="font-body text-xs text-silver">Mempelai Pria</p>
                  </div>
                  <div>
                    <div className="mb-2 h-px bg-gradient-to-r from-transparent via-primary-silver to-transparent"></div>
                    <p className="font-elegant text-charcoal">{brideName}</p>
                    <p className="font-body text-xs text-silver">Mempelai Wanita</p>
                  </div>
                </div>
              </div>

              {/* Closing Message */}
              <div className="text-center mt-8">
                <div className="inline-block bg-platinum/50 rounded-lg px-6 py-3">
                  <p className="font-script text-xl text-charcoal italic">
                    "Together is a wonderful place to be"
                  </p>
                </div>
              </div>
            </div>

            {/* Letter Footer */}
            <div className="bg-silver-gradient p-4 text-center">
              <p className="font-elegant text-white text-sm">
                Your presence is the greatest gift
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-silver px-8 py-3 font-medium inline-flex items-center justify-center space-x-2">
              <SilverEnvelope size={20} />
              <span>Save Invitation</span>
            </button>
            <button className="btn-silver px-8 py-3 font-medium inline-flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Share Invitation</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverEnvelope size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverHeart size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverEnvelope size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>
    </section>
  );
};

export default PrayerLetter;