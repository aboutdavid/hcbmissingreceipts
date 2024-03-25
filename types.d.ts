interface Transaction {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    memo: string;
    date: string;
    type: string;
    pending: boolean;
    receipts: {
      count: number;
      missing: boolean;
    };
    comments: {
      count: number;
    };
    organization: {
      id: string;
      object: string;
      href: string;
      name: string;
      slug: string;
      website: string;
      category: string;
      transparent: boolean;
      demo_mode: boolean;
      logo: string;
      donation_header: string;
      background_image: string;
      public_message: string;
      donation_link: string;
      balances: Record<string, any>;
      created_at: string;
      users: Record<string, any>[];
    };
    tags: Record<string, any>[];
    card_charge: Record<string, any>;
    ach_transfer: {
      id: string;
      object: string;
      href: string;
      memo: string;
      transaction: Record<string, any>;
      organization: {
        balances: Record<string, any>;
        users: any[];
      };
      amount_cents: string;
      date: string;
      status: string;
      beneficiary: Record<string, any>;
    };
    check: {
      id: string;
      object: string;
      href: string;
      memo: string;
      transaction: Record<string, any>;
      organization: {
        balances: Record<string, any>;
        users: any[];
      };
      amount_cents: number;
      date: string;
      status: string;
    };
    donation: {
      id: string;
      object: string;
      href: string;
      memo: string;
      transaction: Record<string, any>;
      organization: {
        balances: Record<string, any>;
        users: any[];
      };
      amount_cents: number;
      donor: Record<string, any>;
      date: string;
      status: string;
      recurring: boolean;
    };
    invoice: {
      id: string;
      object: string;
      href: string;
      memo: string;
      transaction: Record<string, any>;
      organization: {
        balances: Record<string, any>;
        users: any[];
      };
      amount_cents: string;
      sponsor: Record<string, any>;
      date: string;
      status: string;
    };
    transfer: {
      id: string;
      object: string;
      href: string;
      memo: string;
      transaction: Record<string, any>;
      organization: {
        balances: Record<string, any>;
        users: any[];
      };
      amount_cents: string;
      date: string;
      status: string;
    };
  }
  
  interface Organization {
    id: string;
    object: string;
    href: string;
    name: string;
    slug: string;
    website: string;
    category: string;
    transparent: boolean;
    demo_mode: boolean;
    logo: string;
    donation_header: string;
    background_image: string;
    public_message: string;
    donation_link: string;
    balances: {
      balance_cents: number;
      fee_balance_cents: number;
      incoming_balance_cents: number;
      total_raised: number;
    };
    created_at: string;
    users: Record<string, any>[];
  }
  
  interface Card {
    id: string;
    object: string;
    href: string;
    name: string;
    type: string;
    status: string;
    issued_at: string;
    owner: {
      id: string;
      object: string;
      full_name: string;
      admin: boolean;
      photo: string;
    };
    organization: Organization;
  }
  
  interface User {
    id: string;
    object: string;
    full_name: string;
    admin: boolean;
    photo: string;
  }
  
  interface ChargeModel {
    id: string;
    object: string;
    href: string;
    memo: string;
    transaction: Transaction;
    organization: Organization;
    amount_cents: number;
    date: string;
    card: Card;
    user: User;
  }
  
  export default Transaction;
  