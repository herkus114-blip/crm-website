import React from 'react';
import { ExternalLink, Building2, FileText, Map as MapIcon, Landmark, ScrollText, HardHat } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import PageHeader from '@/components/ui-parts';

const LINKS = [
  {
    icon: Building2,
    titleLt: 'Registrų centras',
    titleEn: 'State Enterprise Centre of Registers',
    titleRu: 'Государственное предприятие «Центр регистров»',
    descLt: 'Nekilnojamojo turto, juridinių asmenų, adresų ir kitų registrų duomenys, kadastriniai matavimai, sklypų ir pastatų registracija.',
    descEn: 'Real estate, legal entities, addresses and other registries, cadastral measurements, plot and building registration.',
    descRu: 'Данные реестров недвижимости, юридических лиц, адресов и других регистров, кадастровые измерения, регистрация участков и зданий.',
    url: 'https://www.registrucentras.lt/',
    catLt: 'Žemė ir nuosavybė',
    catEn: 'Land & property',
    catRu: 'Земля и собственность'
  },
  {
    icon: FileText,
    titleLt: 'Planuojuostatau.lt',
    titleEn: 'Planuojuostatau.lt',
    titleRu: 'Planuojuostatau.lt',
    descLt: 'Teritorijų planavimo dokumentų portalas — detalieji ir bendrieji planai, sprendiniai, žemėnaudos paskirtys, statybiniai reikalavimai.',
    descEn: 'Territorial planning documents portal — detailed and general plans, solutions, land use purposes, construction requirements.',
    descRu: 'Портал документов территориального планирования — детальные и общие планы, решения, целевое назначение земель, строительные требования.',
    url: 'https://www.planuojustatau.lt/',
    catLt: 'Planavimas',
    catEn: 'Planning',
    catRu: 'Планирование'
  },
  {
    icon: Landmark,
    titleLt: 'Lietuvos Respublikos Vyriausybė',
    titleEn: 'Government of the Republic of Lithuania',
    titleRu: 'Правительство Литовской Республики',
    descLt: 'Oficiali vyriausybės svetainė — teisės aktai, strategijos, statybos ir teritorijų plėtros politikos dokumentai.',
    descEn: 'Official government website — legislation, strategies, construction and territorial development policy documents.',
    descRu: 'Официальный сайт правительства — законодательные акты, стратегии, документы политики строительства и территориального развития.',
    url: 'https://www.lrv.lt/',
    catLt: 'Teisė ir politika',
    catEn: 'Law & policy',
    catRu: 'Право и политика'
  },
  {
    icon: ScrollText,
    titleLt: 'Teisinės informacijos portalas (TAR)',
    titleEn: 'Legal Information Portal (TAR)',
    titleRu: 'Портал правовой информации (TAR)',
    descLt: 'Valstybės žinios ir Teisės aktų registras — visi oficialūs teisės aktai, įskaitant Statybos įstatymą ir poįstatyminius aktus.',
    descEn: 'State Gazette and Legal Acts Register — all official legislation, including the Construction Law and subordinate acts.',
    descRu: 'Ведомости государства и Реестр правовых актов — все официальные законодательные акты, включая Закон о строительстве и подзаконные акты.',
    url: 'https://www.e-tar.lt/',
    catLt: 'Teisės aktai',
    catEn: 'Legislation',
    catRu: 'Законодательство'
  },
  {
    icon: HardHat,
    titleLt: 'Statybos valdymo ir priežiūros informacinė sistema',
    titleEn: 'Construction Management & Supervision Information System',
    titleRu: 'Информационная система управления и контроля строительства',
    descLt: 'Statybos darbų ataskaitos, techninė priežiūra, statinių priežiūra, statybos procesų registracija ir valdymas.',
    descEn: 'Construction work reports, technical supervision, building supervision, registration and management of construction processes.',
    descRu: 'Отчёты о строительных работах, технический надзор, надзор за зданиями, регистрация и управление строительными процессами.',
    url: 'https://statybprieziura.lrv.lt/',
    catLt: 'Statybos priežiūra',
    catEn: 'Construction supervision',
    catRu: 'Строительный надзор'
  },
  {
    icon: MapIcon,
    titleLt: 'Žemės ūkio ministerija — Kaimo plėtra',
    titleEn: 'Ministry of Agriculture — Rural Development',
    titleRu: 'Министерство сельского хозяйства — Развитие сёл',
    descLt: 'Žemės reformos duomenys, kaimo plėtros programos, žemės ūkio paskirties žemės valdymas ir tvarkymas.',
    descEn: 'Land reform data, rural development programmes, management and maintenance of agricultural land.',
    descRu: 'Данные земельной реформы, программы развития сёл, управление и содержание сельскохозяйственных земель.',
    url: 'https://zum.lrv.lt/',
    catLt: 'Žemės ūkis',
    catEn: 'Agriculture',
    catRu: 'Сельское хозяйство'
  }
];

export default function GovernmentLinks() {
  const { lang, t } = useApp();
  const tr = (lt, en, ru) => lang === 'en' ? en : lang === 'ru' ? ru : lt;

  return (
    <div>
      <PageHeader
        title={lang === 'en' ? 'Government Links' : lang === 'ru' ? 'Государственные ссылки' : 'Vyriausybinių institucijų nuorodos'}
        subtitle={lang === 'en' ? 'Official Lithuanian government resources and registries' : lang === 'ru' ? 'Официальные правительственные ресурсы и реестры Литвы' : 'Oficialios Lietuvos valstybinių institucijų nuorodos'}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link, i) => {
          const Icon = link.icon;
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  <Icon className="h-5 w-5" />
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200" />
              </div>
              <div className="mt-3 flex-1">
                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {tr(link.catLt, link.catEn, link.catRu)}
                </span>
                <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{tr(link.titleLt, link.titleEn, link.titleRu)}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr(link.descLt, link.descEn, link.descRu)}</p>
              </div>
              <p className="mt-3 truncate text-xs font-medium text-slate-400 dark:text-slate-500">{link.url}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}