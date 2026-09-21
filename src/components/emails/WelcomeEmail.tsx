import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Button, Preview } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  code: string;
  confirmLink: string;
}

export default function WelcomeEmail({ name, code, confirmLink }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your next chapter is waiting.</Preview>
      <Body style={{ backgroundColor: '#f8f9fb', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', margin: '40px auto', padding: '40px', borderRadius: '8px', border: '1px solid #dae0e9', maxWidth: '500px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c333d', margin: '0 0 20px 0' }}>
            Welcome, {name.split(' ')[0]}.
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
            You're now part of the De Reality Spec community. We're glad you're here.
          </Text>
          <Text style={{ color: '#2c333d', fontSize: '16px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
            To take the next step and lock in your offer, confirm your interest below. Our team will then guide you through the opportunity details and payment instructions.
          </Text>
          <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
            <Button href={confirmLink} style={{ backgroundColor: '#0E4FAB', color: '#ffffff', padding: '14px 24px', borderRadius: '6px', fontWeight: '500', textDecoration: 'none', display: 'inline-block' }}>
              Confirm my interest
            </Button>
          </Section>
          <Section style={{ backgroundColor: '#e6f0fa', padding: '20px', borderRadius: '8px', textAlign: 'center' as const, marginBottom: '24px' }}>
            <Text style={{ color: '#093375', fontSize: '14px', margin: '0 0 8px 0' }}>Your referral code</Text>
            <Text style={{ color: '#0E4FAB', fontSize: '24px', fontWeight: 'bold', margin: '0', letterSpacing: '2px' }}>{code}</Text>
          </Section>
          <Text style={{ color: '#7d8692', fontSize: '15px', lineHeight: '1.5', margin: '0' }}>
            Here's to meaningful connections,<br />
            <strong style={{ color: '#2c333d' }}>The De Reality Spec team</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
