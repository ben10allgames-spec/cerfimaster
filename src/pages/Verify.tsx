import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  Award, 
  Calendar, 
  Building2, 
  User,
  Shield,
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface CertificateData {
  id: string;
  credential_id: string;
  recipient_name: string;
  recipient_email: string | null;
  course_name: string | null;
  organization_name: string | null;
  issue_date: string;
  template_name: string | null;
  is_valid: boolean;
}

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [credentialId, setCredentialId] = useState(searchParams.get('id') || '');
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!credentialId.trim()) {
      setError('Please enter a credential ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await supabase
        .from('certificates')
        .select('*')
        .eq('credential_id', credentialId.trim())
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setCertificate(data);
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred while verifying the certificate. Please try again.');
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify if ID is in URL params
  React.useEffect(() => {
    if (searchParams.get('id') && !searched) {
      handleVerify();
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">CertiMaster</span>
          </Link>
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Shield className="w-3 h-3 mr-1" />
            Certificate Verification
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search Section */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-white">Verify Certificate</CardTitle>
              <CardDescription className="text-slate-400">
                Enter the credential ID to verify the authenticity of a certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="flex gap-3">
                <Input
                  placeholder="Enter Credential ID (e.g., CERT-XXXXXX)"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="flex-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Verify
                </Button>
              </form>
              {error && (
                <p className="text-destructive text-sm mt-3">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {searched && !isLoading && (
            <Card className={`${certificate?.is_valid ? 'bg-emerald-950/30 border-emerald-700/50' : 'bg-red-950/30 border-red-700/50'} backdrop-blur-sm`}>
              <CardContent className="pt-6">
                {certificate ? (
                  <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center gap-3">
                      {certificate.is_valid ? (
                        <>
                          <CheckCircle className="w-12 h-12 text-emerald-500" />
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-emerald-400">Certificate Verified</h3>
                            <p className="text-emerald-300/70 text-sm">This certificate is authentic and valid</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-12 h-12 text-red-500" />
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-red-400">Certificate Revoked</h3>
                            <p className="text-red-300/70 text-sm">This certificate is no longer valid</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Certificate Details */}
                    <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-400 text-sm">Recipient Name</p>
                          <p className="text-white font-medium">{certificate.recipient_name}</p>
                        </div>
                      </div>

                      {certificate.course_name && (
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-slate-400 text-sm">Course / Program</p>
                            <p className="text-white font-medium">{certificate.course_name}</p>
                          </div>
                        </div>
                      )}

                      {certificate.organization_name && (
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-slate-400 text-sm">Issuing Organization</p>
                            <p className="text-white font-medium">{certificate.organization_name}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-400 text-sm">Issue Date</p>
                          <p className="text-white font-medium">{formatDate(certificate.issue_date)}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-slate-400 text-sm">Credential ID</p>
                        <code className="text-primary font-mono text-sm">{certificate.credential_id}</code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-400 mb-2">Certificate Not Found</h3>
                    <p className="text-slate-400">
                      No certificate was found with the provided credential ID.
                      Please check the ID and try again.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          {!searched && (
            <div className="text-center text-slate-400 mt-8">
              <p className="text-sm">
                The credential ID can be found at the bottom of the certificate.
                <br />
                It usually starts with "CERT-" followed by a unique identifier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
