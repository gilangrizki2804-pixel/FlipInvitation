/**
 * KONFIGURASI DATA UNDANGAN
 * Anda dapat mengubah teks, nama, tanggal, lokasi, dan nomor rekening di bawah ini sesuai keinginan.
 */

const WEDDING_CONFIG = {
  // Informasi Mempelai
  brideAndGroom: {
    groom: {
      callName: "Raden",
      fullName: "Raden Arya Wicaksana, S.T.",
      sonOf: "Putra pertama dari Bpk. Bambang Sutrisno & Ibu Sri Rahayu",
      instagram: "@raden.arya"
    },
    bride: {
      callName: "Arum",
      fullName: "Arum Sekar Kinanthi, S.Ds.",
      daughterOf: "Putri kedua dari Bpk. Hartono Wijaya & Ibu Endang Lestari",
      instagram: "@arum.kinanthi"
    },
    coupleTitle: "Raden & Arum"
  },

  // Kutipan & Salam
  quote: {
    title: "QS. Ar-Rum: 21",
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    translation: "\"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antarmu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.\""
  },

  // Rangkaian Acara
  events: {
    akad: {
      title: "Akad Nikah",
      date: "Sabtu, 24 Oktober 2026",
      time: "08.00 - 10.00 WIB",
      locationName: "Gedung Sasana Kriya (Taman Mini)",
      address: "Jl. Taman Mini Indonesia Indah, Ceger, Cipayung, Jakarta Timur"
    },
    resepsi: {
      title: "Resepsi Pernikahan",
      date: "Sabtu, 24 Oktober 2026",
      time: "11.00 - 14.00 WIB",
      locationName: "Grand Ballroom Sasana Kriya",
      address: "Jl. Taman Mini Indonesia Indah, Ceger, Cipayung, Jakarta Timur"
    },
    // Target countdown (format: YYYY-MM-DDTHH:mm:ss)
    countdownTarget: "2026-10-24T08:00:00+07:00",
    googleMapsUrl: "https://maps.google.com/?q=Sasana+Kriya+TMII+Jakarta",
    calendarDetails: {
      title: "The Wedding of Raden & Arum",
      description: "Menghadiri Pernikahan Raden Arya Wicaksana & Arum Sekar Kinanthi di Sasana Kriya TMII.",
      location: "Sasana Kriya, TMII, Jakarta Timur",
      start: "20261024T010000Z", // UTC format
      end: "20261024T070000Z"
    }
  },

  // Cerita Perjalanan Cinta (Timeline)
  loveStory: [
    {
      year: "2021",
      title: "Awal Berjumpa",
      desc: "Pertemuan pertama kami di sebuah pameran seni rupa di Yogyakarta yang membawa kami ke obrolan hangat."
    },
    {
      year: "2023",
      title: "Menjalin Komitmen",
      desc: "Setelah dua tahun saling mengenal dan saling mendukung impian, kami sepakat untuk melangkah ke jenjang yang lebih serius."
    },
    {
      year: "2025",
      title: "Hari Lamaran",
      desc: "Dengan restu kedua orang tua dan keluarga besar, ikatan suci ini kami resmikan dalam prosesi lamaran yang khidmat."
    },
    {
      year: "2026",
      title: "Menuju Babak Baru",
      desc: "Kini kami siap mengikat janji suci pernikahan untuk melangkah bersama mengarungi sisa usia."
    }
  ],

  // Amplop Digital / Hadiah Pernikahan
  gifts: [
    {
      type: "bank",
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Raden Arya Wicaksana"
    },
    {
      type: "bank",
      bankName: "Bank Mandiri",
      accountNumber: "9876543210123",
      accountHolder: "Arum Sekar Kinanthi"
    },
    {
      type: "gift",
      label: "Kirim Kado Fisik",
      address: "Penerima: Raden Arya / Arum (0812-3456-7890)\nJl. Cendrawasih No. 18, Kebayoran Baru, Jakarta Selatan, 12150"
    }
  ],

  // Audio / Musik Latar (Instrumental Romantis Jawa / Wedding)
  audio: {
    // URL musik default: gending gamelan jawa / instrumental romantis wedding
    url: "https://actions.google.com/sounds/v1/water/gentle_stream_waterfall.ogg", // audio fallback
    // Ganti dengan file mp3 lokal Anda, misal: "music.mp3"
    customMusicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-114407.mp3",
    title: "Gending Ketawang / Romantic Javanese Nuance"
  }
};
