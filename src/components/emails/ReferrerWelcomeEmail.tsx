import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Button, Preview, Img } from '@react-email/components';

interface ReferrerWelcomeEmailProps {
  name: string;
  code: string;
}

export default function ReferrerWelcomeEmail({ name, code }: ReferrerWelcomeEmailProps) {
  const referralLink = "https://realityflex.vercel.app/?ref=${code}";
  
  return (
    <Html>
      <Head />
      <Preview>Your Reality Flex 3.0 Referral Code</Preview>
      <Body style={{ backgroundColor: '#f8f9fb', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', margin: '40px auto', padding: '40px', borderRadius: '8px', border: '1px solid #dae0e9', maxWidth: '500px' }}>
          
          {/* Logo Section */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '32px' }}>
            <Img 
              src="https://realityflex.vercel.app/images/logo.png" 
              alt="De Reality Spec Ltd. Logo" 
              width="80" 
              height="auto" 
              style={{ margin: '0 auto', display: 'block' }} 
            />
          </Section>

          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c333d', margin: '0 0 20px 0', textAlign: 'center' as const }}>
            Welcome, {name.split(' ')[0]}.
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
            You're now an official advocate for Reality Flex 3.0. Thank you for joining our Rewards Program.
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
            Your unique referral code is <strong style={{color: '#0E4FAB'}}>{code}</strong>. Share your personal link below with your network. Whenever someone registers and subscribes using your link, you'll earn cash rewards and shopping experiences!
          </Text>
          
          <Section style={{ textAlign: 'center' as const, marginBottom: '32px' }}>
            <Button href={referralLink} style={{ backgroundColor: '#0E4FAB', color: '#ffffff', padding: '14px 24px', borderRadius: '6px', fontWeight: '500', textDecoration: 'none', display: 'inline-block' }}>
              Your Referral Link
            </Button>
          </Section>

          <Text style={{ color: '#7d8692', fontSize: '15px', lineHeight: '1.5', margin: '0', textAlign: 'center' as const }}>
            Here's to rewarding connections,<br />
            <strong style={{ color: '#2c333d' }}>De Reality Spec Ltd.</strong>
          </Text>

        </Container>
      </Body>
    </Html>
  );
}
