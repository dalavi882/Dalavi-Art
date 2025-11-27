class SupabaseMock {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('aurelia_db_v2')) {
            // AUTO GENERATE 50 ARTWORKS
            const categories = ['Painting', 'Sculpture', 'Digital', 'Photography', 'Mixed Media'];
            const artists = ['Elena Vora', 'Marcus Chen', 'Sarah Jenkins', 'Yoko I.', 'Davide Silva', 'Arthur Pendelton', 'CryptoPunks Legacy', 'Aisha N.'];
            const artworks = [];
            
            for(let i=0; i<50; i++) {
                const cat = categories[i % categories.length];
                let price = Math.floor(Math.random() * 200000) + 5000;
                let title = `${["Ethereal", "Golden", "Silent", "Velvet", "Obsidian", "Liquid", "Fractured", "Eternal"][i % 8]} ${["Void", "Dreams", "Echo", "Horizon", "Fragment", "Soul", "Vision", "Light"][i % 8]} ${i+1}`;
                
                // Custom Unsplash Keywords for variety
                let kw = cat === 'Sculpture' ? 'sculpture' : cat === 'Digital' ? 'neon,cyber' : 'abstract,art';
                
                artworks.push({
                    id: 1000 + i,
                    title: title,
                    artist: artists[i % artists.length],
                    price: price,
                    image: `https://images.unsplash.com/photo-${[
                        '1579783902614-a3fb3927b6a5', '1554188248-986adbb73be0', '1550684848-fac1c5b4e853', '1561214115-f2f134cc4912', 
                        '1549887552-93f8efb87349', '1515405295579-ba7b45403062', '1536924940846-227afb31e2a5', '1513364776144-60967b0f800f',
                        '1547891650-43fe13863e64', '1578301978693-85ea9ec2a638', '1578927803186-26cb4033e209', '1581337253216-558490748349'
                    ][i % 12]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
                    desc: `An exploration of ${cat.toLowerCase()} examining the relationship between light and texture. Authenticated on blockchain.`,
                    type: cat,
                    views: Math.floor(Math.random() * 500),
                    isAuction: i % 5 === 0, // 20% are auctions
                    isGated: price > 100000 // Gated price for high value
                });
            }

            const initialData = {
                config: {
                    siteName: "AURELIA",
                    welcomeTitle: "OWN ETERNITY",
                    welcomeSub: "The World's Most Secure Art Exchange",
                    welcomeDesc: "Aurelia bridges the physical and digital. We offer white-glove service, secure storage, and fractional ownership of history's greatest works.",
                    contactEmail: "concierge@aurelia.global",
                    nextDropDate: new Date(Date.now() + 259200000).toISOString(),
                    nextDropTitle: "The Obsidian Series"
                },
                users: [
                    { id: 1, type: 'admin', name: 'Chief Curator', user: 'admin', pass: 'admin123', level: 100 },
                    { id: 2, type: 'collector', name: 'VIP Guest', user: 'guest', pass: 'guest', favorites: [], level: 1, xp: 0, isVIP: false }
                ],
                artworks: artworks,
                analytics: { visits: 5420, sales: 42, revenue: 4500000 }
            };
            localStorage.setItem('aurelia_db_v2', JSON.stringify(initialData));
        }
        this.data = JSON.parse(localStorage.getItem('aurelia_db_v2'));
    }

    save() { localStorage.setItem('aurelia_db_v2', JSON.stringify(this.data)); }

    from(table) {
        const _this = this;
        return {
            select: () => _this.data[table],
            insert: (row) => { _this.data[table].unshift(row); _this.save(); },
            update: (id, updates) => {
                const idx = _this.data[table].findIndex(item => item.id == id);
                if(idx > -1) {
                     _this.data[table][idx] = { ..._this.data[table][idx], ...updates };
                     _this.save();
                }
            },
            delete: (id) => {
                _this.data[table] = _this.data[table].filter(item => item.id != id);
                _this.save();
            }
        }
    }
}

const DB = new SupabaseMock();

// ==========================================
// AUTH MANAGER
// ==========================================
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(sessionStorage.getItem('aurelia_user')) || null;
    }
    isLoggedIn() { return !!this.currentUser; }
    isAdmin() { return this.currentUser && this.currentUser.type === 'admin'; }
    
    login(username, password, token) {
        const user = DB.data.users.find(u => u.user.toLowerCase() === username.toLowerCase() && u.pass === password);
        if (user) {
            if(user.type === 'admin' && token !== '123456') return { success: false, msg: 'Invalid 2FA Token' };
            
            this.currentUser = user;
            sessionStorage.setItem('aurelia_user', JSON.stringify(user));
            // UI.showToast is in main JS, we will return success and handle UI there or emit event
            return { success: true, user: user };
        }
        return { success: false, msg: 'Invalid Credentials' };
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('aurelia_user');
    }

    addXP(amount) {
        if(!this.isLoggedIn() || this.isAdmin()) return;
        this.currentUser.xp = (this.currentUser.xp || 0) + amount;
        if(this.currentUser.xp > 1000 * this.currentUser.level) {
            this.currentUser.level++;
            return { leveledUp: true, level: this.currentUser.level };
        }
        sessionStorage.setItem('aurelia_user', JSON.stringify(this.currentUser));
        return { leveledUp: false };
    }
}
const Auth = new AuthManager();

// ==========================================
// CART MANAGER
// ==========================================
class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('aurelia_cart')) || [];
    }
    
    add(id) {
        const art = DB.from('artworks').select().find(a => a.id == id);
        if(art && !this.items.find(i => i.id == id)) {
            this.items.push(art);
            this.save();
            return true;
        }
        return false;
    }
    
    remove(id) {
        this.items = this.items.filter(i => i.id != id);
        this.save();
    }
    
    save() {
        localStorage.setItem('aurelia_cart', JSON.stringify(this.items));
    }
    
    clear() {
        this.items = [];
        this.save();
    }
    
    total() {
        return this.items.reduce((acc, item) => acc + item.price, 0);
    }
}
const Cart = new CartManager();
