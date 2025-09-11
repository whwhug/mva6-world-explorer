import React, { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface TokenInputProps {
  onTokenSet: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenSet }) => {
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.startsWith('pk.')) {
      onTokenSet(token);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-elegant">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Mapbox Token Required</h2>
          <p className="text-sm text-muted-foreground">
            To display the interactive globe, please enter your Mapbox public token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-foreground mb-2">
              Mapbox Public Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="pk.your_mapbox_token_here"
              className={`w-full px-3 py-2 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                !isValid ? 'border-destructive' : 'border-border'
              }`}
            />
            {!isValid && (
              <p className="text-sm text-destructive mt-1">
                Please enter a valid Mapbox public token (starts with "pk.")
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Launch Globe
          </button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">How to get your token:</h3>
          <ol className="text-xs text-muted-foreground space-y-1">
            <li>1. Visit <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
              mapbox.com <ExternalLink className="w-3 h-3" />
            </a></li>
            <li>2. Create a free account or sign in</li>
            <li>3. Go to your Account dashboard</li>
            <li>4. Find "Access tokens" section</li>
            <li>5. Copy your default public token</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TokenInput;