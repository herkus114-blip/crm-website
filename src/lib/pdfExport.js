import { jsPDF } from 'jspdf';
import { formatCurrency, formatNumber, formatDate } from './armarisUtils';

const BRAND = 'ARMARIS LT';
const PRIMARY = [15, 23, 42]; // slate-900

function header(doc, title, lang) {
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(BRAND, 14, 12);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(200, 200, 200);
  const tagline = lang === 'en' ? 'Construction Development CRM' : lang === 'ru' ? 'CRM управления строительством' : 'Statybų plėtros CRM';
  doc.text(tagline, 14, 19);
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(title, 14, 40);
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(14, 43, 196, 43);
}

function footer(doc, lang) {
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont(undefined, 'normal');
    const locale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'lt-LT';
    const date = new Date().toLocaleDateString(locale);
    doc.text(`${BRAND} · ${date}`, 14, 290);
    doc.text(`${i} / ${pages}`, 196, 290, { align: 'right' });
  }
}

function section(doc, title, y) {
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text(title, 14, y);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(14, y + 1.5, 196, y + 1.5);
  return y + 7;
}

function row(doc, label, value, y) {
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(String(label || ''), 18, y);
  doc.setTextColor(15, 23, 42);
  doc.setFont(undefined, 'bold');
  const val = String(value ?? '—');
  const lines = doc.splitTextToSize(val, 170);
  doc.text(lines, 80, y);
  return y + 5 + (lines.length > 1 ? (lines.length - 1) * 4.5 : 0);
}

const yn = (v, lang) => v ? (lang === 'en' ? 'Yes' : lang === 'ru' ? 'Да' : 'Taip') : (lang === 'en' ? 'No' : lang === 'ru' ? 'Нет' : 'Ne');

export function exportHousePdf(h, lang = 'lt') {
  const doc = new jsPDF();
  header(doc, `${lang === 'en' ? 'House' : lang === 'ru' ? 'Дом' : 'Namas'} ${h.internal_house_number || ''}`, lang);
  let y = 50;

  y = section(doc, lang === 'en' ? 'Specifications' : lang === 'ru' ? 'Технические характеристики' : 'Techninės specifikacijos', y);
  const specs = [
    [lang === 'en' ? 'Model' : lang === 'ru' ? 'Модель' : 'Modelis', h.house_model],
    [lang === 'en' ? 'Plot' : lang === 'ru' ? 'Участок' : 'Klotuvė', h.plot_number],
    [lang === 'en' ? 'Address' : lang === 'ru' ? 'Адрес' : 'Adresas', h.address],
    [lang === 'en' ? 'Development' : lang === 'ru' ? 'Проект' : 'Projektas', h.development_name],
    [lang === 'en' ? 'Gross area' : lang === 'ru' ? 'Общая площадь' : 'Bendras plotas', formatNumber(h.gross_area, 'm²')],
    [lang === 'en' ? 'Useful area' : lang === 'ru' ? 'Полезная площадь' : 'Naudingas plotas', formatNumber(h.useful_area, 'm²')],
    [lang === 'en' ? 'Floors' : lang === 'ru' ? 'Этажи' : 'Aukštai', h.floors],
    [lang === 'en' ? 'Bedrooms' : lang === 'ru' ? 'Спальни' : 'Miegamieji', h.bedrooms],
    [lang === 'en' ? 'Bathrooms' : lang === 'ru' ? 'Ванные' : 'Vonios', h.bathrooms],
    [lang === 'en' ? 'Energy class' : lang === 'ru' ? 'Энергокласс' : 'Energijos klasė', h.energy_target],
    [lang === 'en' ? 'Foundation' : lang === 'ru' ? 'Фундамент' : 'Pamatas', h.foundation_type],
    [lang === 'en' ? 'Structure' : lang === 'ru' ? 'Конструкция' : 'Konstrukcija', h.structure_type],
    [lang === 'en' ? 'Façade' : lang === 'ru' ? 'Фасад' : 'Fasadas', h.facade_type],
    [lang === 'en' ? 'Roof' : lang === 'ru' ? 'Крыша' : 'Stogas', h.roof_type],
    [lang === 'en' ? 'Heating' : lang === 'ru' ? 'Отопление' : 'Šildymas', h.heating_system],
    [lang === 'en' ? 'Ventilation' : lang === 'ru' ? 'Вентиляция' : 'Vėdinimas', h.ventilation_system]
  ];
  specs.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });

  y = section(doc, lang === 'en' ? 'Sales & Warranty' : lang === 'ru' ? 'Продажи и гарантия' : 'Pardavimai ir garantija', y);
  const sales = [
    [lang === 'en' ? 'Sale price' : lang === 'ru' ? 'Цена продажи' : 'Pardavimo kaina', formatCurrency(h.sale_price)],
    [lang === 'en' ? 'Cost' : lang === 'ru' ? 'Стоимость' : 'Savikaina', formatCurrency(h.cost)],
    [lang === 'en' ? 'Margin %' : lang === 'ru' ? 'Маржа %' : 'Marža %', h.forecast_margin != null ? `${h.forecast_margin}%` : '—'],
    [lang === 'en' ? 'Buyer' : lang === 'ru' ? 'Покупатель' : 'Pirkėjas', h.customer_name],
    [lang === 'en' ? 'Sales status' : lang === 'ru' ? 'Статус продажи' : 'Pardavimo statusas', h.sales_status],
    [lang === 'en' ? 'Warranty end' : lang === 'ru' ? 'Конец гарантии' : 'Garantijos pabaiga', formatDate(h.warranty_end)],
    [lang === 'en' ? 'Warranty start' : lang === 'ru' ? 'Начало гарантии' : 'Garantijos pradžia', formatDate(h.warranty_start)]
  ];
  sales.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });

  y = section(doc, lang === 'en' ? 'Permits & Registration' : lang === 'ru' ? 'Разрешения и регистрация' : 'Leidimai ir registracija', y);
  const perms = [
    [lang === 'en' ? 'Permit status' : lang === 'ru' ? 'Статус разрешения' : 'Leidimo statusas', h.permit_status],
    [lang === 'en' ? 'Registration' : lang === 'ru' ? 'Регистрация' : 'Registracija', h.registration_status],
    [lang === 'en' ? 'Supervisor' : lang === 'ru' ? 'Руководитель' : 'Atsakingas vadovas', h.responsible_supervisor],
    [lang === 'en' ? 'Construction phase' : lang === 'ru' ? 'Фаза строительства' : 'Statybos fazė', h.current_phase],
    [lang === 'en' ? 'Current blocker' : lang === 'ru' ? 'Текущее препятствие' : 'Dabartinė kliūtis', h.current_blocker],
    [lang === 'en' ? 'Planned completion' : lang === 'ru' ? 'Плановое завершение' : 'Planuojama užbaigti', formatDate(h.planned_completion)],
    [lang === 'en' ? 'Actual completion' : lang === 'ru' ? 'Фактическое завершение' : 'Faktinė užbaiga', formatDate(h.actual_completion)],
    [lang === 'en' ? 'Reported progress' : lang === 'ru' ? 'Заявленный прогресс' : 'Praneštas progresas', h.reported_progress != null ? `${h.reported_progress}%` : '—'],
    [lang === 'en' ? 'Calculated progress' : lang === 'ru' ? 'Расчётный прогресс' : 'Skaičiuotas progresas', h.calculated_progress != null ? `${h.calculated_progress}%` : '—']
  ];
  perms.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });

  footer(doc, lang);
  doc.save(`Namas_${h.internal_house_number || h.id}.pdf`);
}

export function exportPlotPdf(p, lang = 'lt') {
  const doc = new jsPDF();
  header(doc, `${lang === 'en' ? 'Plot' : lang === 'ru' ? 'Участок' : 'Klotuvė'} ${p.internal_plot_number || ''}`, lang);
  let y = 50;
  y = section(doc, lang === 'en' ? 'Details' : lang === 'ru' ? 'Детали' : 'Išsami informacija', y);
  const rows = [
    [lang === 'en' ? 'Internal no.' : lang === 'ru' ? 'Внутренний №' : 'Vidinis nr.', p.internal_plot_number],
    [lang === 'en' ? 'Cadastral no.' : lang === 'ru' ? 'Кадастровый №' : 'Kadastrinis nr.', p.cadastral_number],
    [lang === 'en' ? 'Development' : lang === 'ru' ? 'Проект' : 'Projektas', p.development_name],
    [lang === 'en' ? 'Area' : lang === 'ru' ? 'Площадь' : 'Plotas', formatNumber(p.area_ares, 'arai')],
    [lang === 'en' ? 'Plot status' : lang === 'ru' ? 'Статус участка' : 'Klotuvės statusas', p.plot_status],
    [lang === 'en' ? 'Building zone' : lang === 'ru' ? 'Зона застройки' : 'Statybinė zona', p.building_zone],
    [lang === 'en' ? 'Max floors' : lang === 'ru' ? 'Макс. этажи' : 'Maks. aukštai', p.max_floors],
    [lang === 'en' ? 'Max height' : lang === 'ru' ? 'Макс. высота' : 'Maks. aukštis', p.max_height],
    [lang === 'en' ? 'Utility connection' : lang === 'ru' ? 'Подключение коммуникаций' : 'Komunalinė', p.utility_connection_status],
    [lang === 'en' ? 'Road access' : lang === 'ru' ? 'Дорожный доступ' : 'Kelių prieiga', p.road_access_status],
    [lang === 'en' ? 'Assigned house model' : lang === 'ru' ? 'Назначенная модель' : 'Priskirtas modelis', p.assigned_house_model],
    [lang === 'en' ? 'Sale price' : lang === 'ru' ? 'Цена продажи' : 'Pardavimo kaina', formatCurrency(p.sale_price)],
    [lang === 'en' ? 'Buyer' : lang === 'ru' ? 'Покупатель' : 'Pirkėjas', p.buyer_name],
    [lang === 'en' ? 'Reservation expiry' : lang === 'ru' ? 'Окончание брони' : 'Rezervacijos pabaiga', formatDate(p.reservation_expiry)],
    [lang === 'en' ? 'Title registration' : lang === 'ru' ? 'Регистрация права' : 'Nuosavybės registracija', p.title_registration_status]
  ];
  rows.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });
  footer(doc, lang);
  doc.save(`Klotuve_${p.internal_plot_number || p.id}.pdf`);
}

export function exportLandPdf(p, lang = 'lt') {
  const doc = new jsPDF();
  header(doc, lang === 'en' ? 'Land Parcel' : lang === 'ru' ? 'Земельный участок' : 'Žemės sklypas', lang);
  let y = 50;
  y = section(doc, lang === 'en' ? 'Details' : lang === 'ru' ? 'Детали' : 'Išsami informacija', y);
  const rows = [
    [lang === 'en' ? 'Cadastral no.' : lang === 'ru' ? 'Кадастровый №' : 'Kadastrinis nr.', p.cadastral_number],
    [lang === 'en' ? 'Address' : lang === 'ru' ? 'Адрес' : 'Adresas', p.address],
    [lang === 'en' ? 'Development' : lang === 'ru' ? 'Проект' : 'Projektas', p.development_name],
    [lang === 'en' ? 'Owner' : lang === 'ru' ? 'Владелец' : 'Savininkas', p.owner],
    [lang === 'en' ? 'Seller' : lang === 'ru' ? 'Продавец' : 'Pardavėjas', p.seller],
    [lang === 'en' ? 'Land use' : lang === 'ru' ? 'Назначение' : 'Paskirtis', p.land_use_purpose],
    [lang === 'en' ? 'Total area (ha)' : lang === 'ru' ? 'Общая площадь (га)' : 'Bendras plotas (ha)', formatNumber(p.total_area_ha, 'ha')],
    [lang === 'en' ? 'Total area (ares)' : lang === 'ru' ? 'Общая площадь (ары)' : 'Bendras plotas (arai)', formatNumber(p.total_area_ares, 'arai')],
    [lang === 'en' ? 'Acquisition price' : lang === 'ru' ? 'Цена приобретения' : 'Įsigijimo kaina', formatCurrency(p.acquisition_price)],
    [lang === 'en' ? 'Acquisition costs' : lang === 'ru' ? 'Затраты на приобретение' : 'Įsigijimo išlaidos', formatCurrency(p.acquisition_costs)],
    [lang === 'en' ? 'Mortgage status' : lang === 'ru' ? 'Ипотека' : 'Įkaito statusas', p.mortgage_status],
    [lang === 'en' ? 'Easements' : lang === 'ru' ? 'Сервитуты' : 'Servitutai', p.easements],
    [lang === 'en' ? 'Access' : lang === 'ru' ? 'Доступ' : 'Prieiga', p.access_status],
    [lang === 'en' ? 'Utilities' : lang === 'ru' ? 'Коммуникации' : 'Komunalinė', p.utility_availability],
    [lang === 'en' ? 'Zoning' : lang === 'ru' ? 'Зонирование' : 'Zonavimas', p.zoning_status],
    [lang === 'en' ? 'Protected area' : lang === 'ru' ? 'Охраняемая зона' : 'Saugoma teritorija', yn(p.protected_area, lang)],
    [lang === 'en' ? 'Coastal zone' : lang === 'ru' ? 'Прибрежная зона' : 'Pajūrio zona', yn(p.coastal_zone, lang)],
    [lang === 'en' ? 'Cultural heritage' : lang === 'ru' ? 'Культурное наследие' : 'Kultūros paveldas', yn(p.cultural_heritage, lang)],
    [lang === 'en' ? 'Flood risk' : lang === 'ru' ? 'Риск затопления' : 'Užtvindymo rizika', yn(p.flood_risk, lang)],
    [lang === 'en' ? 'Geotechnical' : lang === 'ru' ? 'Геотехника' : 'Geotechnika', p.geotechnical_status],
    [lang === 'en' ? 'Contamination' : lang === 'ru' ? 'Загрязнение' : 'Tarša', p.contamination_status],
    [lang === 'en' ? 'Due diligence' : lang === 'ru' ? 'Due diligence' : 'Due diligence', p.due_diligence_result],
    [lang === 'en' ? 'Registrų centras ref.' : lang === 'ru' ? 'Ссылка Регистров' : 'Registrų centras', p.registrų_centras_reference],
    [lang === 'en' ? 'Purchase contract' : lang === 'ru' ? 'Договор купли' : 'Pirkimo sutartis', p.purchase_contract_ref],
    [lang === 'en' ? 'Title registration' : lang === 'ru' ? 'Регистрация права' : 'Nuosavybės registracija', formatDate(p.title_registration_date)]
  ];
  rows.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });
  footer(doc, lang);
  doc.save(`Zeme_${p.cadastral_number || p.id}.pdf`);
}

export function exportDocumentPdf(d, lang = 'lt') {
  const doc = new jsPDF();
  header(doc, lang === 'en' ? 'Document' : lang === 'ru' ? 'Документ' : 'Dokumentas', lang);
  let y = 50;
  y = section(doc, lang === 'en' ? 'Details' : lang === 'ru' ? 'Детали' : 'Išsami informacija', y);
  const rows = [
    [lang === 'en' ? 'Title' : lang === 'ru' ? 'Название' : 'Pavadinimas', d.title],
    [lang === 'en' ? 'Document type' : lang === 'ru' ? 'Тип документа' : 'Dokumento tipas', d.document_type],
    [lang === 'en' ? 'Document number' : lang === 'ru' ? 'Номер документа' : 'Dokumento numeris', d.document_number],
    [lang === 'en' ? 'Development' : lang === 'ru' ? 'Проект' : 'Projektas', d.development_name],
    [lang === 'en' ? 'Issue date' : lang === 'ru' ? 'Дата выдачи' : 'Išdavimo data', formatDate(d.issue_date)],
    [lang === 'en' ? 'Expiry date' : lang === 'ru' ? 'Срок действия' : 'Galiojimo pabaiga', formatDate(d.expiry_date)],
    [lang === 'en' ? 'Issuing authority' : lang === 'ru' ? 'Орган выдачи' : 'Išdavusi institucija', d.issuing_authority],
    [lang === 'en' ? 'External reference' : lang === 'ru' ? 'Внешний №' : 'Išorinis numeris', d.external_reference],
    [lang === 'en' ? 'Language' : lang === 'ru' ? 'Язык' : 'Kalba', d.language],
    [lang === 'en' ? 'Version' : lang === 'ru' ? 'Версия' : 'Versija', d.version],
    [lang === 'en' ? 'Status' : lang === 'ru' ? 'Статус' : 'Statusas', d.status],
    [lang === 'en' ? 'Uploader' : lang === 'ru' ? 'Загрузил' : 'Įkėlė', d.uploader],
    [lang === 'en' ? 'Reviewer' : lang === 'ru' ? 'Рецензент' : 'Peržiūrėjo', d.reviewer],
    [lang === 'en' ? 'Approver' : lang === 'ru' ? 'Утвердил' : 'Patvirtino', d.approver],
    [lang === 'en' ? 'Confidentiality' : lang === 'ru' ? 'Конфиденциальность' : 'Konfidencialumas', d.confidentiality]
  ];
  rows.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });
  footer(doc, lang);
  doc.save(`Dokumentas_${d.document_number || d.id}.pdf`);
}

export function exportDevelopmentPdf(dev, lang = 'lt') {
  const doc = new jsPDF();
  header(doc, dev.name || '', lang);
  let y = 50;
  y = section(doc, lang === 'en' ? 'Details' : lang === 'ru' ? 'Детали' : 'Išsami informacija', y);
  const rows = [
    [lang === 'en' ? 'Internal code' : lang === 'ru' ? 'Внутренний код' : 'Vidinis kodas', dev.internal_code],
    [lang === 'en' ? 'Municipality' : lang === 'ru' ? 'Муниципалитет' : 'Savivaldybė', dev.municipality],
    [lang === 'en' ? 'Eldership' : lang === 'ru' ? 'Староство' : 'Seniūnija', dev.eldership],
    [lang === 'en' ? 'Address' : lang === 'ru' ? 'Адрес' : 'Adresas', dev.address],
    [lang === 'en' ? 'Type' : lang === 'ru' ? 'Тип' : 'Tipas', dev.development_type],
    [lang === 'en' ? 'Area (ha)' : lang === 'ru' ? 'Площадь (га)' : 'Plotas (ha)', formatNumber(dev.original_area_ha, 'ha')],
    [lang === 'en' ? 'Planned plots' : lang === 'ru' ? 'Плановые участки' : 'Planuojamos klotuvės', dev.planned_plots],
    [lang === 'en' ? 'Planned houses' : lang === 'ru' ? 'Плановые дома' : 'Planuojami namai', dev.planned_houses],
    [lang === 'en' ? 'Lifecycle phase' : lang === 'ru' ? 'Фаза' : 'Etapas', dev.lifecycle_phase],
    [lang === 'en' ? 'Reported progress' : lang === 'ru' ? 'Прогресс' : 'Progresas', dev.reported_progress != null ? `${dev.reported_progress}%` : '—'],
    [lang === 'en' ? 'Responsible director' : lang === 'ru' ? 'Директор' : 'Direktorius', dev.responsible_director],
    [lang === 'en' ? 'Responsible manager' : lang === 'ru' ? 'Менеджер' : 'Vadybininkas', dev.responsible_manager],
    [lang === 'en' ? 'Acquisition date' : lang === 'ru' ? 'Дата приобретения' : 'Įsigijimo data', formatDate(dev.acquisition_date)],
    [lang === 'en' ? 'Planned completion' : lang === 'ru' ? 'Плановое завершение' : 'Planuojama užbaigti', formatDate(dev.planned_completion_date)],
    [lang === 'en' ? 'Legal status' : lang === 'ru' ? 'Юридический статус' : 'Teisinė būklė', dev.legal_status],
    [lang === 'en' ? 'Planning status' : lang === 'ru' ? 'Статус планировки' : 'Planavimo statusas', dev.planning_status],
    [lang === 'en' ? 'Infrastructure' : lang === 'ru' ? 'Инфраструктура' : 'Infrastruktūra', dev.infrastructure_status],
    [lang === 'en' ? 'Construction' : lang === 'ru' ? 'Строительство' : 'Statyba', dev.construction_status],
    [lang === 'en' ? 'Sales' : lang === 'ru' ? 'Продажи' : 'Pardavimai', dev.sales_status],
    [lang === 'en' ? 'Risk score' : lang === 'ru' ? 'Оценка риска' : 'Rizikos įvertinimas', dev.risk_score],
    [lang === 'en' ? 'Top blocker' : lang === 'ru' ? 'Главное препятствие' : 'Pagrindinė kliūtis', dev.top_blocker],
    [lang === 'en' ? 'Next milestone' : lang === 'ru' ? 'Следующий этап' : 'Kitas žingsnis', dev.next_milestone]
  ];
  rows.forEach(([l, v]) => { y = row(doc, l, v, y); if (y > 270) { doc.addPage(); y = 20; } });
  footer(doc, lang);
  doc.save(`Projektas_${dev.internal_code || dev.id}.pdf`);
}