import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Preview, Img } from '@react-email/components';

interface ReferrerEmailProps {
  name: string;
  code: string;
}

export default function ReferrerEmail({ name, code }: ReferrerEmailProps) {
  const referralLink = `https://realityflex.vercel.app/?ref=${code}`;
  
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Reality Flex 3.0 Referral Program.</Preview>
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
            Welcome, {name.split(' ')[0]}!
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
            You are now an official advocate for <strong>Reality Flex 3.0</strong>.
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
            Help others start their land ownership journey and get rewarded for every successful subscription.
          </Text>

          <div style={{ background: '#f8f9fb', padding: '20px', borderRadius: '8px', margin: '24px 0', textAlign: 'center', border: '1px dashed #dae0e9' }}>
            <Text style={{ margin: '0', fontSize: '12px', color: '#7d8692', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Personal Referral Link
            </Text>
            <Text style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#0e4fab' }}>
              {referralLink}
            </Text>
          </div>
  
          <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c333d', margin: '0 0 12px 0' }}>
            Your Rewards:
          </Text>
          <ul style={{ color: '#2c333d', fontSize: '15px', lineHeight: '1.6', paddingLeft: '24px', margin: '0 0 32px 0' }}>
            <li><strong>1 Referral:</strong> <span>&#8358;</span>20,000 Cash Reward</li>
            <li><strong>3 Referrals:</strong> <span>&#8358;</span>70,000 Cash Reward + <span>&#8358;</span>20,000 Shopping Experience</li>
            <li><strong>5 Referrals:</strong> <span>&#8358;</span>125,000 Cash Reward + <span>&#8358;</span>40,000 Shopping Experience</li>
          </ul>
          
          {/* Footer Branding */}
          <Text style={{ color: '#7d8692', fontSize: '15px', lineHeight: '1.5', margin: '0', textAlign: 'center' as const }}>
            Thank you for partnering with us,<br />
            <strong style={{ color: '#2c333d' }}>De Reality Spec Ltd.</strong>
          </Text>

        </Container>
      </Body>
    </Html>
  );
}
