import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Button, Preview, Img } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  brochureLink: string;
}

export default function WelcomeEmail({ name, brochureLink }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your next chapter is waiting.</Preview>
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
            You're now part of the De Reality Spec community. We're glad you're here.
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
            To take the next step, please review our introductory brochure. Once your payment has been verified, our team will send you a manual acknowledgement.
          </Text>
          
          {/* Brochure Download Button */}
          <Section style={{ textAlign: 'center' as const, marginBottom: '32px' }}>
            <Button href={brochureLink} style={{ backgroundColor: '#0E4FAB', color: '#ffffff', padding: '14px 24px', borderRadius: '6px', fontWeight: '500', textDecoration: 'none', display: 'inline-block' }}>
              View the Brochure
            </Button>
          </Section>

          {/* Footer Branding */}
          <Text style={{ color: '#7d8692', fontSize: '15px', lineHeight: '1.5', margin: '0', textAlign: 'center' as const }}>
            Here's to meaningful connections,<br />
            <strong style={{ color: '#2c333d' }}>De Reality Spec Ltd.</strong>
          </Text>

        </Container>
      </Body>
    </Html>
  );
}