// src/pages/Auth.tsx

/* eslint-disable @typescript-eslint/no-misused-promises */
import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  FormEvent,
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Key,
} from 'lucide-react';
import ReactSelect, { SingleValue } from 'react-select';
import { get } from '../api/axios';
import { FcGoogle } from 'react-icons/fc'; // ✅ NEW

/* ------------------------------------------------------------------ */
/* Country types & helpers                                            */
/* ------------------------------------------------------------------ */
export interface Country {
  _id: string;
  countryName: string;
  callingCode: string; // e.g. +1
  countryCode: string; // e.g. US
  flag: string; // e.g. 🇺🇸
}

export interface CountryOption {
  value: string; // _id (what we POST later)
  label: string; // UI label
  country: Country;
}
interface Option {
  value: string;
  label: string;
}

const buildCountryOptions = (list: Country[]): CountryOption[] =>
  list.map((c) => ({
    value: c._id,
    label: `${c.flag} ${c.countryName}`,
    country: c,
  }));

const filterByCountryName = (
  option: { data: CountryOption },
  rawInput: string,
) => {
  const input = rawInput.toLowerCase().trim().replace(/^\+/, '');
  const { country } = option.data;
  return (
    country.countryName.toLowerCase().includes(input) ||
    country.countryCode.toLowerCase().includes(input) ||
    country.callingCode.replace(/^\+/, '').includes(input)
  );
};

/* ------------------------------------------------------------------ */
/* Shared field components                                            */
/* ------------------------------------------------------------------ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  toggleIcon?: React.ReactNode;
  onToggle?: () => void;
}
const Input: React.FC<InputProps> = ({
  label,
  icon,
  toggleIcon,
  onToggle,
  ...props
}) => (
  <div>
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-12 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-xl
                   placeholder-gray-400 text-gray-700 focus:outline-none
                   focus:ring-2 focus:ring-[#3E82F7] focus:border-transparent"
      />
      {toggleIcon && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {toggleIcon}
        </button>
      )}
    </div>
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  icon: React.ReactNode;
  value: string;
  options: Option[] | CountryOption[];
  onChange: (name: string, value: string) => void;
}
const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  icon,
  value,
  options,
  onChange,
}) => (
  <div>
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <div className="pl-10">
        <ReactSelect
          classNamePrefix="rs"
          placeholder={`Select ${label.toLowerCase()}`}
          options={options}
          value={(options as any).find((o: Option) => o.value === value) || null}
          onChange={(opt: SingleValue<Option>) => opt && onChange(name, opt.value)}
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#F3F4F6',
              borderRadius: '0.75rem',
              borderColor: '#E5E7EB',
              paddingLeft: '0.25rem',
              minHeight: '3rem',
              boxShadow: 'none',
              '&:hover': { borderColor: '#C7D2FE' },
            }),
            menu: (base) => ({ ...base, zIndex: 20 }),
          }}
        />
      </div>
    </div>
  </div>
);

const genderOpts: Option[] = [
  { value: '0', label: 'Male' },
  { value: '1', label: 'Female' },
  { value: '2', label: 'Other' },
];

const DecorativeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className="absolute bg-[#E6FDFC] rounded-full"
      style={{ width: 600, height: 600, top: -200, left: -200 }}
    />
    <div
      className="absolute bg-[#E6FDFC] rounded-full"
      style={{ width: 500, height: 500, bottom: -150, right: -150 }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Mini-forms                                                         */
/* ------------------------------------------------------------------ */
interface MiniProps {
  form: FormState;
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const LoginForm: React.FC<
  MiniProps & {
    onSubmit: (e: FormEvent) => void;
    showPwd: boolean;
    togglePwd: () => void;
  }
> = ({ form, loading, onChange, onSubmit, showPwd, togglePwd }) => (
  <form onSubmit={onSubmit} className="space-y-5 animate-fade-in">
    <Input
      label="Email Address"
      name="email"
      icon={<Mail />}
      type="email"
      value={form.email}
      onChange={onChange}
      required
    />
    <Input
      label="Password"
      name="password"
      icon={<Lock />}
      type={showPwd ? 'text' : 'password'}
      value={form.password}
      onChange={onChange}
      toggleIcon={showPwd ? <EyeOff /> : <Eye />}
      onToggle={togglePwd}
      required
    />
    <button
      disabled={loading}
      className="w-full py-3 rounded-xl font-bold text-white
            bg-gradient-to-r from-[#3E82F7] to-[#6BA7FF] hover:from-[#366FCC] hover:to-[#549CEB]
            transform hover:scale-[1.02] shadow-lg"
    >
      {loading ? 'Logging in…' : 'Login Now'}
    </button>
  </form>
);

export const EmailForm: React.FC<
  MiniProps & { onSubmit: (e: FormEvent) => void }
> = ({ form, loading, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-5 animate-fade-in">
    <Input
      label="Email Address"
      name="email"
      icon={<Mail />}
      type="email"
      value={form.email}
      onChange={onChange}
      required
    />
    <button
      disabled={loading}
      className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r
                       from-[#3E82F7] to-[#6BA7FF] hover:from-[#366FCC] hover:to-[#549CEB]
                       transform hover:scale-[1.02] shadow-lg"
    >
      {loading ? 'Sending…' : 'Send OTP'}
    </button>
  </form>
);

export const OtpForm: React.FC<
  MiniProps & { onSubmit: (e: FormEvent) => void }
> = ({ form, loading, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-5 animate-fade-in">
    <Input
      label="6-digit OTP"
      name="otp"
      icon={<Key />}
      value={form.otp}
      onChange={onChange}
      maxLength={6}
      pattern="\d{6}"
      inputMode="numeric"
      required
    />
    <button
      disabled={loading}
      className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r
                       from-[#3E82F7] to-[#6BA7FF] hover:from-[#366FCC] hover:to-[#549CEB]
                       transform hover:scale-[1.02] shadow-lg"
    >
      {loading ? 'Verifying…' : 'Verify OTP'}
    </button>
  </form>
);

/* ------------------------------------------------------------------ */
/* DetailsForm (moved out & memoised)                                 */
/* ------------------------------------------------------------------ */
export interface FormState {
  email: string;
  otp: string;
  password: string;
  name: string;
  phone: string;
  callingId: string;
  countryId: string;
  address: string;
  gender: string;
}

interface DetailsProps {
  form: FormState;
  loading: boolean;
  showPwd: boolean;
  countryOptions: CountryOption[];
  codeOptions: CountryOption[];
  upd: (e: ChangeEvent<HTMLInputElement>) => void;
  sel: (name: string, opt: SingleValue<CountryOption | Option>) => void;
  togglePwd: () => void;
  onRegister: (e: FormEvent) => void;
}

export const DetailsForm: React.FC<DetailsProps> = React.memo(
  ({
    form,
    loading,
    showPwd,
    countryOptions,
    codeOptions,
    upd,
    sel,
    togglePwd,
    onRegister,
  }) => (
    <form onSubmit={onRegister} className="space-y-5 animate-fade-in">
      <Input
        label="Full Name"
        name="name"
        icon={<User />}
        value={form.name}
        onChange={upd}
        required
      />

      {/* calling code + phone */}
      <div className="flex gap-3">
        <div className="w-2/5">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Calling ID
          </label>
          <ReactSelect<CountryOption, false>
            options={codeOptions}
            placeholder="+Code"
            value={codeOptions.find((o) => o.value === form.callingId) || null}
            onChange={(opt) => sel('callingId', opt)}
            filterOption={filterByCountryName}
            isSearchable
          />
        </div>
        <div className="flex-1">
          <Input
            label="Phone Number"
            name="phone"
            icon={<Phone />}
            value={form.phone}
            onChange={upd}
            required
          />
        </div>
      </div>

      <label className="block mb-2 text-sm font-semibold text-gray-700">
        Country
      </label>
      <ReactSelect<CountryOption, false>
        options={countryOptions}
        placeholder="Select Country"
        value={countryOptions.find((o) => o.value === form.countryId) || null}
        onChange={(opt) => sel('countryId', opt)}
        filterOption={filterByCountryName}
        isSearchable
      />

      <SelectField
        label="Gender"
        name="gender"
        icon={<User />}
        value={form.gender}
        options={genderOpts}
        onChange={(n, v) => sel(n, { value: v, label: '' } as any)}
      />

      <Input
        label="Password"
        name="password"
        icon={<Lock />}
        type={showPwd ? 'text' : 'password'}
        value={form.password}
        onChange={upd}
        toggleIcon={showPwd ? <EyeOff /> : <Eye />}
        onToggle={togglePwd}
        required
      />

      <button
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r
              from-[#3E82F7] to-[#6BA7FF] hover:from-[#366FCC] hover:to-[#549CEB]
              transform hover:scale-[1.02] shadow-lg"
      >
        {loading ? 'Signing up…' : 'Complete Registration'}
      </button>
    </form>
  ),
);

/* ------------------------------------------------------------------ */
/* Main Auth component                                                */
/* ------------------------------------------------------------------ */
const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [loading, setLoad] = useState(false);
  const [msg, setMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState<FormState>({
    email: '',
    otp: '',
    password: '',
    name: '',
    phone: '',
    callingId: '',
    countryId: '',
    address: '',
    gender: '',
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const nav = useNavigate();
  const { login, register, requestOtp, verifyOtp, isAuthenticated, googleLogin } = useAuth(); // ✅ include googleLogin

  /* country load */
  useEffect(() => {
    (async () => {
      try {
        const res = await get('/country/getall');
        const list: Country[] = res;
        setCountries(list);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* build option arrays */
  const countryOptions = useMemo(() => buildCountryOptions(countries), [countries]);

  const codeOptions: CountryOption[] = useMemo(() => {
    const opts = countries.map((c) => ({
      value: c._id,
      label: `${c.flag} ${c.callingCode}`,
      country: c,
    }));

    // put US at the top if present
    const usIdx = opts.findIndex((o) => o.country.countryCode === 'US');
    if (usIdx > -1) {
      const [us] = opts.splice(usIdx, 1);
      opts.unshift(us);
    }
    return opts;
  }, [countries]);

  /* redirect when already auth */
  useEffect(() => {
    if (isAuthenticated) nav('/', { replace: true });
  }, [isAuthenticated, nav]);

  /* helpers */
  const upd = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const sel = (
    name: string,
    opt: SingleValue<CountryOption | Option>,
  ) => opt && setForm((p) => ({ ...p, [name]: opt.value }));
  const flash = (type: 'success' | 'error', text: string) =>
    setMsg({ type, text });
  const resetAll = () => {
    setForm({
      email: '',
      otp: '',
      password: '',
      name: '',
      phone: '',
      countryId: '',
      callingId: '',
      address: '',
      gender: '',
    });
    setMsg(null);
    setLoad(false);
    setShowPwd(false);
  };

  /* flows */
  const onSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setMsg(null);
    (await requestOtp(form.email))
      ? (flash('success', 'OTP sent!'), setStep('otp'))
      : flash('error', 'Unable to send OTP.');
    setLoad(false);
  };
  const onVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setMsg(null);
    (await verifyOtp(form.email, form.otp))
      ? (flash('success', 'OTP verified!'), setStep('details'))
      : flash('error', 'Invalid OTP.');
    setLoad(false);
  };
  const onRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setMsg(null);
    (await register(form as any))
      ? (flash('success', 'Registration successful!'),
        nav('/', { replace: true }))
      : flash('error', 'Registration failed.');
    setLoad(false);
  };
  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setMsg(null);
    (await login(form.email, form.password))
      ? (flash('success', 'Login successful!'), nav('/', { replace: true }))
      : flash('error', 'Invalid email or password.');
    setLoad(false);
  };

  // ✅ Google flow
  const onGoogle = async () => {
    setLoad(true);
    setMsg(null);
    const ok = await googleLogin();
    if (ok) {
      flash('success', 'Logged in with Google!');
      nav('/', { replace: true });
    } else {
      flash('error', 'Google sign-in failed.');
    }
    setLoad(false);
  };

  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-white-1 relative overflow-hidden px-4">
      <Link to="/" className="absolute top-20 left-100 z-20 flex items-center hover:scale-105 transition-transform">
                  {/* Logo from public/logo.png */}
                  <img
                    src="/logo.png"
                    alt="LikLet logo"
                    className="h-20 w-30 object-contain drop-shadow-xl"
                    loading="eager"
                  />
                  <span className="text-blue-800 text-6xl font-bold">LikLet</span>
      
                </Link>

      <DecorativeBackground />

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex z-10">
        <div className="hidden md:block w-1/2">
          <img
            src={mode === 'login' ? '/side_image.png' : '/register.png'}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 relative">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
            {mode === 'login'
              ? 'Welcome Back'
              : step === 'email'
              ? 'Verify Your Email'
              : step === 'otp'
              ? 'Enter OTP'
              : 'Create Your Account'}
          </h1>

          {msg && (
            <div
              className={`mb-6 px-5 py-4 rounded-xl flex items-center border shadow-sm animate-fade-in
                             ${
                               msg.type === 'success'
                                 ? 'bg-green-50 border-green-200 text-green-700'
                                 : 'bg-red-50 border-red-200 text-red-700'
                             }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle className="mr-3" />
              ) : (
                <AlertCircle className="mr-3" />
              )}
              <span className="font-medium">{msg.text}</span>
            </div>
          )}

          {mode === 'login' && (
            <LoginForm
              form={form}
              loading={loading}
              onChange={upd}
              onSubmit={onLogin}
              showPwd={showPwd}
              togglePwd={() => setShowPwd((p) => !p)}
            />
          )}
          {mode === 'register' && step === 'email' && (
            <EmailForm
              form={form}
              loading={loading}
              onChange={upd}
              onSubmit={onSendOtp}
            />
          )}
          {mode === 'register' && step === 'otp' && (
            <OtpForm
              form={form}
              loading={loading}
              onChange={upd}
              onSubmit={onVerifyOtp}
            />
          )}
          {mode === 'register' && step === 'details' && (
            <DetailsForm
              form={form}
              loading={loading}
              showPwd={showPwd}
              countryOptions={countryOptions}
              codeOptions={codeOptions}
              upd={upd}
              sel={sel}
              togglePwd={() => setShowPwd((p) => !p)}
              onRegister={onRegister}
            />
          )}

          {/* ✅ Social login (shown for both login & register modes) */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs uppercase tracking-wider text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            type="button"
            onClick={onGoogle}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-white border border-gray-200
                       shadow-sm hover:shadow-md flex items-center justify-center gap-3"
          >
            <FcGoogle size={22} />
            {loading ? 'Connecting…' : 'Continue with Google'}
          </button>

          <div className="mt-6 flex justify-between text-sm text-gray-600">
            {mode === 'login' ? (
              <button className="hover:underline">Forgot Password?</button>
            ) : (
              <button
                onClick={() => {
                  setMode('login');
                  resetAll();
                }}
                className="hover:underline"
              >
                Already have an account? Login
              </button>
            )}
            <button
              onClick={() => {
                setMode((m) => (m === 'login' ? 'register' : 'login'));
                resetAll();
              }}
              className="font-medium text-blue-600 hover:underline"
            >
              {mode === 'login' ? 'Register Now' : 'Back to Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
