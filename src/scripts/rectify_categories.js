const Database = require('better-sqlite3');
const path = require('path');

// Connect to the SQLite database
const dbPath = path.resolve(__dirname, '../../portfolio.db');
const db = new Database(dbPath);

const categoriesMap = [
  {
    name: 'الأمن السيبراني',
    keywords: [
      'security', 'cyber', 'threat', 'malware', 'attack', 'hacker', 'encryption', 'network',
      'أمن', 'سيبراني', 'هجوم', 'اختراق', 'تحقيق', 'تشفير', 'شبكات', 'فيروس', 'برمجيات خبيثة'
    ]
  },
  {
    name: 'الفلسفة والفكر الإسلامي',
    keywords: [
      'philosophy', 'ethics', 'religion', 'islam', 'ethics', 'metaphysics', 'logic',
      'فلسفة', 'فكر', 'إسلام', 'أخلاق', 'دين', 'عقيدة', 'شريعة', 'قرآن', 'سنة', 'حديث',
      'بيجوفيتش', 'عبده', 'الغزالي', 'ابن رشد', 'تصوف', 'لاهوت', 'منطق', 'ثنائية'
    ]
  },
  {
    name: 'الاقتصاد والمجتمع',
    keywords: [
      'economy', 'market', 'trade', 'finance', 'society', 'sociology', 'policy',
      'اقتصاد', 'تجارة', 'سوق', 'بورصة', 'مال', 'بنوك', 'مجتمع', 'اجتماع', 'سياسة',
      'تنمية', 'عولمة', 'رأسمالية', 'اشتراكية', 'تضخم', 'فائدة'
    ]
  },
  {
    name: 'الأدب واللغة',
    keywords: [
      'literature', 'poetry', 'prose', 'linguistics', 'grammer', 'book', 'novel',
      'أدب', 'شعر', 'نثر', 'بلاغة', 'لغة', 'نحو', 'صرف', 'رواية', 'قصة', 'كتاب',
      'كاتب', 'مؤلف', 'نشر', 'طباعة', 'خيال'
    ]
  },
  {
    name: 'تطوير الويب',
    keywords: [
      'next.js', 'react', 'javascript', 'html', 'css', 'coding', 'programming', 'api', 'app',
      'برمجة', 'تطوير', 'تطبيق', 'ويب', 'موقع', 'جافاسكريبت', 'برمجيات', 'تقنية', 'ذكاء اصطناعي'
    ]
  }
];

function rectify() {
  console.log('Starting article category rectification...');
  
  const articles = db.prepare('SELECT id, title, content FROM articles').all();
  console.log(`Analyzing ${articles.length} articles...`);

  let updatedCount = 0;
  
  const updateStmt = db.prepare('UPDATE articles SET category = ? WHERE id = ?');

  const transaction = db.transaction((articlesList) => {
    for (const article of articlesList) {
      const textToAnalyze = (article.title + ' ' + article.content).toLowerCase();
      let bestCategory = 'مقالات ومنوعات'; // Default
      let maxMatches = 0;

      for (const cat of categoriesMap) {
        let matches = 0;
        for (const keyword of cat.keywords) {
          if (textToAnalyze.includes(keyword.toLowerCase())) {
            matches++;
          }
        }
        
        if (matches > maxMatches) {
          maxMatches = matches;
          bestCategory = cat.name;
        }
      }

      // Only update if matched something or if it was null/wrong
      updateStmt.run(bestCategory, article.id);
      updatedCount++;
      
      if (updatedCount % 200 === 0) {
        console.log(`- Processed ${updatedCount} articles...`);
      }
    }
  });

  transaction(articles);
  
  console.log('Rectification complete!');
  console.log(`Successfully updated categories for ${updatedCount} articles.`);
  
  // Show distribution
  const distribution = db.prepare('SELECT category, COUNT(*) as count FROM articles GROUP BY category').all();
  console.log('\nFinal Category Distribution:');
  distribution.forEach(d => console.log(`- ${d.category}: ${d.count}`));
}

try {
  rectify();
} catch (err) {
  console.error('Error during rectification:', err);
} finally {
  db.close();
}
