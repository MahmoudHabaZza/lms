/**
 * Egyptian Cities and Schools Database
 * Organized by governorate for efficient filtering
 */

export interface School {
    id: string;
    name: string;
    city: string;
}

export interface City {
    id: string;
    name: string;
}

export const EGYPTIAN_CITIES: City[] = [
    // Cairo Governorate
    { id: 'cairo', name: 'القاهرة' },
    
    // Alexandria
    { id: 'alexandria', name: 'الإسكندرية' },
    
    // Giza
    { id: 'giza', name: 'الجيزة' },
    
    // Qalyubia
    { id: 'qalyubia', name: 'القليوبية' },
    
    // Helwan
    { id: 'helwan', name: 'حلوان' },
    
    // Port Said
    { id: 'port-said', name: 'بورسعيد' },
    
    // Suez
    { id: 'suez', name: 'السويس' },
    
    // Ismailia
    { id: 'ismailia', name: 'الإسماعيلية' },
    
    // Dakahlia
    { id: 'dakahlia', name: 'الدقهلية' },
    
    // Damietta
    { id: 'damietta', name: 'دمياط' },
    
    // Kafr El-Sheikh
    { id: 'kafr-elsheikh', name: 'كفر الشيخ' },
    
    // Beheira
    { id: 'beheira', name: 'البحيرة' },
    
    // Gharbia
    { id: 'gharbia', name: 'الغربية' },
    
    // Monufia
    { id: 'monufia', name: 'المنوفية' },
    
    // Sharqia
    { id: 'sharqia', name: 'الشرقية' },
    
    // New Cairo
    { id: 'new-cairo', name: 'مدينة نصر' },
    
    // 6th of October City
    { id: '6-october', name: 'مدينة 6 أكتوبر' },
    
    // New Administrative Capital
    { id: 'administrative-capital', name: 'العاصمة الإدارية الجديدة' },
    
    // Minya
    { id: 'minya', name: 'المنيا' },
    
    // Assiut
    { id: 'assiut', name: 'أسيوط' },
    
    // Sohag
    { id: 'sohag', name: 'سوهاج' },
    
    // Qena
    { id: 'qena', name: 'قنا' },
    
    // Luxor
    { id: 'luxor', name: 'الأقصر' },
    
    // Aswan
    { id: 'aswan', name: 'أسوان' },
    
    // Red Sea
    { id: 'red-sea', name: 'البحر الأحمر' },
    
    // Matrouh
    { id: 'matrouh', name: 'مطروح' },
    
    // New Valley
    { id: 'new-valley', name: 'الوادي الجديد' },
    
    // North Sinai
    { id: 'north-sinai', name: 'شمال سيناء' },
    
    // South Sinai
    { id: 'south-sinai', name: 'جنوب سيناء' },
];

export const SCHOOLS_BY_CITY: Record<string, School[]> = {
    cairo: [
        { id: 'cairo-1', name: 'مدرسة النيل الأهلية - مصر الجديدة', city: 'cairo' },
        { id: 'cairo-2', name: 'مدرسة المستقبل - الزمالك', city: 'cairo' },
        { id: 'cairo-3', name: 'مدرسة الحلم - المقطم', city: 'cairo' },
        { id: 'cairo-4', name: 'مدرسة النور الأهلية - الشرقية', city: 'cairo' },
        { id: 'cairo-5', name: 'مدرسة الودود - الوايلي', city: 'cairo' },
        { id: 'cairo-6', name: 'مدرسة الفردوس - حدائق القبة', city: 'cairo' },
    ],
    alexandria: [
        { id: 'alex-1', name: 'مدرسة الإسكندرية الأهلية', city: 'alexandria' },
        { id: 'alex-2', name: 'مدرسة الحضارة - سيدي بشر', city: 'alexandria' },
        { id: 'alex-3', name: 'مدرسة النجاح - الروضة', city: 'alexandria' },
        { id: 'alex-4', name: 'مدرسة المشهد - الاسكندرية', city: 'alexandria' },
    ],
    giza: [
        { id: 'giza-1', name: 'مدرسة الجيزة النموذجية', city: 'giza' },
        { id: 'giza-2', name: 'مدرسة الحرية - الهرم', city: 'giza' },
        { id: 'giza-3', name: 'مدرسة النيل الأهلية - الدقي', city: 'giza' },
        { id: 'giza-4', name: 'مدرسة المستقبل - 6 أكتوبر', city: 'giza' },
        { id: 'giza-5', name: 'مدرسة النور - الشيخ زايد', city: 'giza' },
    ],
    qalyubia: [
        { id: 'qal-1', name: 'مدرسة القليوبية الأهلية', city: 'qalyubia' },
        { id: 'qal-2', name: 'مدرسة النجاح - شبرا', city: 'qalyubia' },
        { id: 'qal-3', name: 'مدرسة الحضارة - بنها', city: 'qalyubia' },
    ],
    helwan: [
        { id: 'hel-1', name: 'مدرسة حلوان الأهلية', city: 'helwan' },
        { id: 'hel-2', name: 'مدرسة المستقبل - حلوان', city: 'helwan' },
    ],
    'port-said': [
        { id: 'port-1', name: 'مدرسة بورسعيد الأهلية', city: 'port-said' },
        { id: 'port-2', name: 'مدرسة النيل - بورسعيد', city: 'port-said' },
    ],
    suez: [
        { id: 'suez-1', name: 'مدرسة السويس الأهلية', city: 'suez' },
        { id: 'suez-2', name: 'مدرسة النور - السويس', city: 'suez' },
    ],
    ismailia: [
        { id: 'ism-1', name: 'مدرسة الإسماعيلية الأهلية', city: 'ismailia' },
        { id: 'ism-2', name: 'مدرسة المستقبل - الإسماعيلية', city: 'ismailia' },
    ],
    dakahlia: [
        { id: 'dak-1', name: 'مدرسة الدقهلية الأهلية', city: 'dakahlia' },
        { id: 'dak-2', name: 'مدرسة النيل - المنصورة', city: 'dakahlia' },
        { id: 'dak-3', name: 'مدرسة النور - الدقهلية', city: 'dakahlia' },
    ],
    damietta: [
        { id: 'dam-1', name: 'مدرسة دمياط الأهلية', city: 'damietta' },
        { id: 'dam-2', name: 'مدرسة المستقبل - دمياط', city: 'damietta' },
    ],
    'kafr-elsheikh': [
        { id: 'kafr-1', name: 'مدرسة كفر الشيخ الأهلية', city: 'kafr-elsheikh' },
    ],
    beheira: [
        { id: 'beh-1', name: 'مدرسة البحيرة الأهلية', city: 'beheira' },
        { id: 'beh-2', name: 'مدرسة النيل - دمنهور', city: 'beheira' },
    ],
    gharbia: [
        { id: 'ghar-1', name: 'مدرسة الغربية الأهلية', city: 'gharbia' },
        { id: 'ghar-2', name: 'مدرسة النور - طنطا', city: 'gharbia' },
    ],
    monufia: [
        { id: 'mon-1', name: 'مدرسة المنوفية الأهلية', city: 'monufia' },
        { id: 'mon-2', name: 'مدرسة النيل - شبين الكوم', city: 'monufia' },
    ],
    sharqia: [
        { id: 'shar-1', name: 'مدرسة الشرقية الأهلية', city: 'sharqia' },
        { id: 'shar-2', name: 'مدرسة المستقبل - الزقازيق', city: 'sharqia' },
        { id: 'shar-3', name: 'مدرسة النور - العاشر من رمضان', city: 'sharqia' },
    ],
    'new-cairo': [
        { id: 'new-cairo-1', name: 'مدرسة النهضة - التجمع الخامس', city: 'new-cairo' },
        { id: 'new-cairo-2', name: 'مدرسة التقدم - التجمع الأول', city: 'new-cairo' },
    ],
    '6-october': [
        { id: 'oct-1', name: 'مدرسة 6 أكتوبر', city: '6-october' },
        { id: 'oct-2', name: 'مدرسة المنار - 6 أكتوبر', city: '6-october' },
    ],
    'administrative-capital': [
        { id: 'adm-1', name: 'مدرسة العاصمة الإدارية', city: 'administrative-capital' },
    ],
    minya: [
        { id: 'min-1', name: 'مدرسة المنيا الأهلية', city: 'minya' },
    ],
    assiut: [
        { id: 'ass-1', name: 'مدرسة أسيوط الأهلية', city: 'assiut' },
    ],
    sohag: [
        { id: 'soh-1', name: 'مدرسة سوهاج الأهلية', city: 'sohag' },
    ],
    qena: [
        { id: 'qe-1', name: 'مدرسة قنا الأهلية', city: 'qena' },
    ],
    luxor: [
        { id: 'lux-1', name: 'مدرسة الأقصر الأهلية', city: 'luxor' },
    ],
    aswan: [
        { id: 'asw-1', name: 'مدرسة أسوان الأهلية', city: 'aswan' },
    ],
    'red-sea': [
        { id: 'rs-1', name: 'مدرسة البحر الأحمر', city: 'red-sea' },
    ],
    matrouh: [
        { id: 'mat-1', name: 'مدرسة مطروح الأهلية', city: 'matrouh' },
    ],
    'new-valley': [
        { id: 'nv-1', name: 'مدرسة الوادي الجديد', city: 'new-valley' },
    ],
    'north-sinai': [
        { id: 'ns-1', name: 'مدرسة شمال سيناء', city: 'north-sinai' },
    ],
    'south-sinai': [
        { id: 'ss-1', name: 'مدرسة جنوب سيناء', city: 'south-sinai' },
    ],
};

/**
 * Get schools for a specific city
 */
export function getSchoolsByCity(cityId: string): School[] {
    return SCHOOLS_BY_CITY[cityId] || [];
}
