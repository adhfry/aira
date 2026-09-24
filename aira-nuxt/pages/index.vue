<script setup lang="ts">
useSeoMeta({
  title: 'AIRA - Artificial Intelligence Response Banjir',
  description:
    'AIRA adalah sistem pemantauan, analisis risiko, dan peringatan dini banjir berbasis AI yang mengintegrasikan CCTV, sensor IoT, data cuaca, dan GIS.',
  ogTitle: 'AIRA - Artificial Intelligence Response Banjir',
  ogDescription: 'Menjaga daerah lebih siap terhadap banjir dengan AI, IoT, dan GIS.',
  ogImage: '/AiraLogo.png',
})
</script>

<template>
  <div>
    <LandingHeroSection />
    <LandingAboutSection />
    <LandingFeatureGrid />
    <LandingDashboardPreview />
    <LandingWorkflowSteps />
    <LandingBenefitGrid />
    <LandingCTASection
      badge="AIRA"
      description="Mari manfaatkan teknologi untuk melindungi masyarakat dan lingkungan kita."
      :primary="{ label: 'Lihat Demo Sistem', to: '/dashboard' }"
      :secondary="{ label: 'Hubungi Kami', to: '#kontak' }"
    >
      Bersama Mewujudkan Daerah<br />yang Lebih Tangguh terhadap Banjir
    </LandingCTASection>
  </div>
</template>
