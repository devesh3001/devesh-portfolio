import { projects, sampleInventory, allocateFefo } from './model.mjs';

const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export const spotlights = {
  mars: {
    label: 'Computer vision · NSSC 2026 second place',
    components: [['Represent', '256-D ConvAE'], ['Score', 'Isolation Forest'], ['Calibrate', 'Held-out sources']],
    note: 'Splitting by source keeps related crops in the same partition. Unusual scores select candidates for inspection; they do not establish geological anomalies.'
  },
  pharma: {
    label: 'Software engineering · Solo project',
    components: [['Authorize', 'JWT / RBAC'], ['Reserve', 'FEFO + transactions'], ['Deliver', 'GPS + OTP']],
    note: 'Serializable stock updates protect concurrent orders. Verified, idempotent payment webhooks prevent repeated events from repeating business actions.'
  },
  optigreen: {
    label: 'Machine learning + optimization · Team project',
    components: [['Forecast', 'Quantile XGBoost'], ['Constrain', 'Pyomo / HiGHS'], ['Plan', 'Rolling MILP']],
    note: 'Forecasts include uncertainty. Capacity, inventory, and shipment constraints turn demand estimates into a feasible production and distribution plan.'
  }
};

export function componentStrip(id) {
  const entry = spotlights[id];
  if (!entry) return '';
  return `<div class="component-strip" aria-label="Core project components">${entry.components.map(([title, detail], index) => `<div><span class="component-index">0${index + 1}</span><strong>${escape(title)}</strong><small>${escape(detail)}</small></div>`).join('')}</div>`;
}

export function initExperience({ updateSupply }) {
  function showSpotlight(id) {
    const project = projects.find(project => project.id === id);
    const entry = spotlights[id];
    if (!project || !entry) return;
    document.querySelectorAll('[data-spotlight]').forEach(button => {
      const selected = button.dataset.spotlight === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $('.preview-topline .mono').textContent = project.number + ' / 03';
    $('#spotlight-content').innerHTML = `<p class="preview-context">${escape(entry.label)}</p><h3>${escape(project.name)}</h3>${componentStrip(id)}<div class="preview-metrics">${project.metrics.slice(0, 2).map(metric => `<div><strong>${escape(metric.value)}</strong><span>${escape(metric.label)}</span></div>`).join('')}</div><div class="preview-decision"><span>DESIGN NOTE</span><p>${escape(entry.note)}</p></div><div class="preview-actions"><button class="text-link" data-case="${escape(id)}">Explore project ↗</button><button class="text-link" data-go-lab="${escape(project.lab)}">Try the method →</button></div>`;
  }
  document.querySelectorAll('[data-spotlight]').forEach(button => button.addEventListener('click', () => showSpotlight(button.dataset.spotlight)));
  showSpotlight('mars');

  const presets = {
    disruption: { demand: 180, outage: 60, carbon: 40 },
    carbon: { demand: 120, outage: 15, carbon: 100 }
  };
  document.querySelectorAll('[data-supply-preset]').forEach(button => button.addEventListener('click', () => {
    const preset = presets[button.dataset.supplyPreset];
    for (const [input, value] of Object.entries(preset)) $('#' + input).value = value;
    updateSupply();
  }));

  let batches = sampleInventory();
  let orderNumber = 0;
  let log = [];
  function drawStock() {
    $('#stock-total').textContent = batches.reduce((sum, batch) => sum + batch.quantity, 0);
    $('#inventory-batches').innerHTML = batches.map(batch => `<div class="inventory-batch${batch.quantity === 0 ? ' depleted' : ''}"><div class="batch-topline"><strong>Batch ${escape(batch.id)}</strong><span>Expires in ${batch.expiresIn} days</span><b>${batch.quantity} units</b></div><div class="batch-meter" role="meter" aria-label="Batch ${escape(batch.id)} stock" aria-valuemin="0" aria-valuemax="${batch.initial}" aria-valuenow="${batch.quantity}"><span style="width:${100 * batch.quantity / batch.initial}%"></span></div><small>${batch.quantity ? 'Available for reservation' : 'Batch depleted'}</small></div>`).join('');
    $('#inventory-log').innerHTML = log.map(entry => `<p><span>${escape(entry.title)}</span>${escape(entry.detail)}</p>`).join('');
  }
  function updateQuantity() {
    $('#order-quantity-value').textContent = $('#order-quantity').value + ' units';
  }
  $('#order-quantity').addEventListener('input', updateQuantity);
  $('#reserve-stock').addEventListener('click', () => {
    const plan = allocateFefo(batches, Number($('#order-quantity').value));
    orderNumber++;
    const detail = plan.ok
      ? plan.allocations.map(allocation => `${allocation.quantity} from batch ${allocation.id}`).join(', ')
      : `Requested ${plan.requested}; available ${plan.total}. No stock changed.`;
    batches = plan.remaining;
    log.unshift({ title: `Order ${orderNumber} · ${plan.ok ? 'reserved' : 'rejected'}`, detail });
    log = log.slice(0, 3);
    $('#reservation-status').dataset.state = plan.ok ? 'success' : 'rejected';
    $('#reservation-status').textContent = plan.ok ? `${plan.requested} units reserved: ${detail}. ${plan.total} units remain.` : `Insufficient stock. ${detail}`;
    drawStock();
  });
  $('#reset-stock').addEventListener('click', () => {
    batches = sampleInventory(); orderNumber = 0; log = [];
    $('#order-quantity').value = 5;
    $('#reservation-status').dataset.state = '';
    $('#reservation-status').textContent = 'Stock reset. Choose a quantity and reserve an order.';
    updateQuantity(); drawStock();
  });
  updateQuantity(); drawStock();
}
