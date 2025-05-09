import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Account {
  id: number;
  business_name: string;
  billing_address?: string;
  billing_location?: string;
  billing_city?: string;
  billing_zip_code?: string;
  shipping_address?: string;
  shipping_location?: string;
  shipping_city?: string;
  shipping_zip_code?: string;
}

interface AccountContact {
  id: number;
  account_id: number;
  name: string;
  email?: string;
  contact_number?: string;
}

interface Props {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  accounts: Account[];
  contacts: AccountContact[];
  processing: boolean;
}

export default function QuotationDetailsForm({ data, setData, errors, accounts, contacts, processing }: Props) {
  const handleAccountChange = (val: string) => {
    const account = accounts.find(acc => acc.id.toString() === val);
    if (!account) return;

    setData('account_id', val);
    setData('billing_address', account.billing_address || '');
    setData('billing_location', account.billing_location || '');
    setData('billing_city', account.billing_city || '');
    setData('billing_zip_code', account.billing_zip_code || '');

    if (data.same_as_billing) {
      setData('shipping_address', account.shipping_address || '');
      setData('shipping_location', account.shipping_location || '');
      setData('shipping_city', account.shipping_city || '');
      setData('shipping_zip_code', account.shipping_zip_code || '');
    }
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setData('same_as_billing', checked);

    if (checked) {
      setData('shipping_address', data.billing_address);
      setData('shipping_location', data.billing_location);
      setData('shipping_city', data.billing_city);
      setData('shipping_zip_code', data.billing_zip_code);
    } else {
      setData('shipping_address', '');
      setData('shipping_location', '');
      setData('shipping_city', '');
      setData('shipping_zip_code', '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData(data);
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <Label>Choose Account *</Label>
              <Select value={data.account_id} onValueChange={handleAccountChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.account_id && <p className="text-sm text-red-500">{errors.account_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Available Size *</Label>
              <Input
                value={data.available_size}
                onChange={(e) => setData('available_size', e.target.value)}
                required
              />
              {errors.available_size && <p className="text-sm text-red-500">{errors.available_size}</p>}
            </div>
            <div>
              <Label>Proposed Size *</Label>
              <Input
                value={data.proposed_size}
                onChange={(e) => setData('proposed_size', e.target.value)}
                required
              />
              {errors.proposed_size && <p className="text-sm text-red-500">{errors.proposed_size}</p>}
            </div>
          </div>

          <div>
            <Label>Description *</Label>
            <Textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              required
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div>
            <Label>Estimate Date *</Label>
            <Input
              type="date"
              value={data.estimate_date}
              onChange={(e) => setData('estimate_date', e.target.value)}
              required
            />
            {errors.estimate_date && <p className="text-sm text-red-500">{errors.estimate_date}</p>}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Billing Address</h3>
            <Textarea
              placeholder="Address"
              value={data.billing_address}
              onChange={(e) => setData('billing_address', e.target.value)}
              required
            />
            <Input
              placeholder="Location"
              value={data.billing_location}
              onChange={(e) => setData('billing_location', e.target.value)}
              required
            />
            <Input
              placeholder="City"
              value={data.billing_city}
              onChange={(e) => setData('billing_city', e.target.value)}
              required
            />
            <Input
              placeholder="ZIP Code"
              value={data.billing_zip_code}
              onChange={(e) => setData('billing_zip_code', e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="same_as_billing" checked={data.same_as_billing} onCheckedChange={handleSameAsBillingChange} />
            <Label htmlFor="same_as_billing">Same as Billing Address</Label>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Shipping Address</h3>
            <Textarea
              placeholder="Address"
              value={data.shipping_address}
              onChange={(e) => setData('shipping_address', e.target.value)}
              disabled={data.same_as_billing}
              required
            />
            <Input
              placeholder="Location"
              value={data.shipping_location}
              onChange={(e) => setData('shipping_location', e.target.value)}
              disabled={data.same_as_billing}
              required
            />
            <Input
              placeholder="City"
              value={data.shipping_city}
              onChange={(e) => setData('shipping_city', e.target.value)}
              disabled={data.same_as_billing}
              required
            />
            <Input
              placeholder="ZIP Code"
              value={data.shipping_zip_code}
              onChange={(e) => setData('shipping_zip_code', e.target.value)}
              disabled={data.same_as_billing}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
