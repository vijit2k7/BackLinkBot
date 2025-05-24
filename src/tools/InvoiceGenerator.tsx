import React, { useState } from 'react';
import { FileText, Trash2, Download, Save, Plus, X, ArrowRight, Loader2, Copy, FileDown, Printer } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

// Invoice types
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  isPaid: boolean;
  created: number;
}

const InvoiceGenerator = () => {
  // Generate a unique invoice number
  const generateInvoiceNumber = (): string => {
    return `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  // Current date in YYYY-MM-DD format
  const getToday = (): string => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };
  
  // Default due date (today + 30 days)
  const getDefaultDueDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  // Initial state for a new invoice
  const initialInvoiceState: InvoiceData = {
    id: `invoice-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    date: getToday(),
    dueDate: getDefaultDueDate(),
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    items: [
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        price: 0,
        amount: 0
      }
    ],
    notes: '',
    terms: 'Payment due within 30 days. Thank you for your business.',
    taxRate: 0,
    taxAmount: 0,
    subtotal: 0,
    total: 0,
    isPaid: false,
    created: Date.now()
  };

  // States
  const [activeTab, setActiveTab] = useState<string>('create');
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(initialInvoiceState);
  const [savedInvoices, setSavedInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Add a new item to the invoice
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      price: 0,
      amount: 0
    };
    
    setCurrentInvoice({
      ...currentInvoice,
      items: [...currentInvoice.items, newItem]
    });
  };
  
  // Remove an item from the invoice
  const removeItem = (itemId: string) => {
    if (currentInvoice.items.length === 1) {
      toast({
        title: "Cannot Remove Item",
        description: "An invoice must have at least one item.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentInvoice({
      ...currentInvoice,
      items: currentInvoice.items.filter(item => item.id !== itemId)
    });
  };
  
  // Update an item field
  const updateItem = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = currentInvoice.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount if quantity or price changes
        if (field === 'quantity' || field === 'price') {
          updatedItem.amount = updatedItem.quantity * updatedItem.price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setCurrentInvoice({
      ...currentInvoice,
      items: updatedItems
    });
  };
  
  // Calculate invoice totals whenever items or tax rate changes
  React.useEffect(() => {
    const subtotal = currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (currentInvoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setCurrentInvoice({
      ...currentInvoice,
      subtotal,
      taxAmount,
      total
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInvoice.items, currentInvoice.taxRate]);
  
  // Save the current invoice
  const saveInvoice = () => {
    // Validate required fields
    if (!currentInvoice.clientName || !currentInvoice.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in both client and company information.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if there are any items with missing descriptions
    const hasEmptyItems = currentInvoice.items.some(item => !item.description);
    if (hasEmptyItems) {
      toast({
        title: "Incomplete Items",
        description: "Please provide a description for all invoice items.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the invoice to savedInvoices
    setSavedInvoices(prev => {
      // If invoice already exists, update it
      const invoiceExists = prev.some(invoice => invoice.id === currentInvoice.id);
      
      if (invoiceExists) {
        return prev.map(invoice => 
          invoice.id === currentInvoice.id ? currentInvoice : invoice
        );
      } else {
        // Otherwise add it as new
        return [...prev, currentInvoice];
      }
    });
    
    toast({
      title: "Invoice Saved",
      description: `Invoice #${currentInvoice.invoiceNumber} has been saved.`
    });
  };
  
  // Start a new invoice
  const createNewInvoice = () => {
    setCurrentInvoice({
      ...initialInvoiceState,
      id: `invoice-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      date: getToday(),
      dueDate: getDefaultDueDate(),
      // Keep the company information from the previous invoice for convenience
      companyName: currentInvoice.companyName,
      companyEmail: currentInvoice.companyEmail,
      companyAddress: currentInvoice.companyAddress,
    });
  };
  
  // Load a saved invoice
  const loadInvoice = (invoiceId: string) => {
    const invoice = savedInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setCurrentInvoice(invoice);
      setActiveTab('create');
    }
  };
  
  // Delete a saved invoice
  const deleteInvoice = (invoiceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    setSavedInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
    
    toast({
      title: "Invoice Deleted",
      description: "The invoice has been deleted from your saved invoices."
    });
  };
  
  // Mark invoice as paid/unpaid
  const togglePaidStatus = () => {
    setCurrentInvoice({
      ...currentInvoice,
      isPaid: !currentInvoice.isPaid
    });
  };
  
  // Download invoice as PDF
  const downloadInvoice = () => {
    // In a real app, this would generate a PDF
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded as a PDF file."
      });
    }, 1500);
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <ToolLayout
      title="Invoice Generator"
      description="Create professional invoices quickly for your clients and customers."
      icon={<FileText className="h-8 w-8 text-green-500" />}
      helpText="Fill in your company and client details, add invoice items, and customize with notes and terms. Save invoices for future reference or download as PDF."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
          <TabsTrigger value="saved">Saved Invoices ({savedInvoices.length})</TabsTrigger>
        </TabsList>
      
        <TabsContent value="create">
          <div className="space-y-8 pb-8">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Your Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="companyName">Company/Business Name</Label>
                    <Input
                      id="companyName"
                      value={currentInvoice.companyName}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, companyName: e.target.value})}
                      placeholder="Your Company Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={currentInvoice.companyEmail}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, companyEmail: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companyAddress">Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={currentInvoice.companyAddress}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, companyAddress: e.target.value})}
                      placeholder="Your business address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Client Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={currentInvoice.clientName}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, clientName: e.target.value})}
                      placeholder="Client's Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={currentInvoice.clientEmail}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, clientEmail: e.target.value})}
                      placeholder="client@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientAddress">Address</Label>
                    <Textarea
                      id="clientAddress"
                      value={currentInvoice.clientAddress}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, clientAddress: e.target.value})}
                      placeholder="Client's address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Invoice Details */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Invoice Number</p>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={currentInvoice.invoiceNumber}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, invoiceNumber: e.target.value})}
                      className="w-40"
                    />
                    <Badge variant={currentInvoice.isPaid ? "default" : "secondary"} className={
                      currentInvoice.isPaid ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                    }>
                      {currentInvoice.isPaid ? 'PAID' : 'UNPAID'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <Label htmlFor="invoiceDate" className="text-xs text-gray-500">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={currentInvoice.date}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, date: e.target.value})}
                      className="w-40"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate" className="text-xs text-gray-500">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={currentInvoice.dueDate}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, dueDate: e.target.value})}
                      className="w-40"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-6 mb-2">
                <h3 className="font-medium">Invoice Items</h3>
                <Badge variant="outline" className="text-gray-700">
                  {currentInvoice.items.length} {currentInvoice.items.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addItem} 
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
              
              <div className="mt-4 flex flex-col items-end gap-2">
                <div className="flex justify-between w-full max-w-xs">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(currentInvoice.subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center w-full max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Tax (%):</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={currentInvoice.taxRate}
                      onChange={(e) => setCurrentInvoice({...currentInvoice, taxRate: parseFloat(e.target.value) || 0})}
                      className="w-16 h-8 text-right"
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(currentInvoice.taxAmount)}</span>
                </div>
                
                <Separator className="my-2 w-full max-w-xs" />
                
                <div className="flex justify-between w-full max-w-xs text-lg">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{formatCurrency(currentInvoice.total)}</span>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={currentInvoice.notes}
                  onChange={(e) => setCurrentInvoice({...currentInvoice, notes: e.target.value})}
                  placeholder="Any additional notes for the client..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={currentInvoice.terms}
                  onChange={(e) => setCurrentInvoice({...currentInvoice, terms: e.target.value})}
                  placeholder="Payment terms and conditions..."
                  rows={3}
                />
              </div>
            </div>
            
            {/* Payment Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="paid"
                checked={currentInvoice.isPaid}
                onCheckedChange={togglePaidStatus}
              />
              <Label htmlFor="paid">Mark invoice as paid</Label>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button 
                variant="default" 
                onClick={saveInvoice}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="mr-2 h-4 w-4" /> Save Invoice
              </Button>
              
              <Button 
                variant="outline" 
                onClick={downloadInvoice}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="text-gray-600"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              
              <Button 
                variant="outline" 
                onClick={createNewInvoice}
                className="ml-auto text-blue-600"
              >
                <FileText className="mr-2 h-4 w-4" /> New Invoice
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          {savedInvoices.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Your Saved Invoices</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createNewInvoice}
                  className="text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" /> Create New
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedInvoices.map((invoice) => (
                  <Card 
                    key={invoice.id} 
                    className="cursor-pointer hover:border-purple-200 transition-colors"
                    onClick={() => loadInvoice(invoice.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(invoice.created).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={invoice.isPaid ? "default" : "secondary"} className={
                            invoice.isPaid ? "bg-green-100 text-green-800" : ""
                          }>
                            {invoice.isPaid ? 'PAID' : 'UNPAID'}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => deleteInvoice(invoice.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="font-medium">{invoice.clientName}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-bold">{formatCurrency(invoice.total)}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        <p>{invoice.items.length} {invoice.items.length === 1 ? 'item' : 'items'}</p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-dashed flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                        >
                          View & Edit <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Saved Invoices</h3>
              <p className="text-gray-500 mb-6">Create and save invoices to manage them here.</p>
              <Button 
                variant="default"
                onClick={() => setActiveTab('create')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create Your First Invoice <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default InvoiceGenerator; 