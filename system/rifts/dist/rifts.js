// Rifts System — v0.1.2 prebuilt (see README for src workflow)
Hooks.once("init", () => {
  if (typeof Handlebars !== "undefined" && !Handlebars.helpers.eq) {
    Handlebars.registerHelper("eq", (a, b) => a === b);
  }
});

function fpmToFps(fpm) { return Number(fpm || 0) / 15; }
function fpsToMph(fps) { return Number(fps || 0) * 0.681818; }

class RiftsActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/rifts/templates/actor-sheet.hbs",
      classes: ["rifts", "sheet", "actor"],
      width: 900, height: 720,
      submitOnChange: true,
      closeOnSubmit: false,
      tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }
  getData(options) {
    const ctx = super.getData(options);
    const sys = (ctx.system = this.actor.system ?? {});
    const defaults = { IQ:0, ME:0, MA:0, PS:0, PP:0, PE:0, PB:0, SPD:0 };
    sys.stats = foundry.utils.mergeObject(defaults, sys.stats ?? {}, { inplace: false });
    sys.combat = sys.combat ?? {};
    if (!sys.combat.scale) sys.combat.scale = "SDC";
    sys.combat.hp  = sys.combat.hp  ?? { value: 10, max: 10 };
    sys.combat.sdc = sys.combat.sdc ?? { value: 0,  max: 0  };
    sys.combat.mdc = sys.combat.mdc ?? { value: 0,  max: 0  };
    sys.combat.apm = sys.combat.apm ?? { base: 4, current: 4 };
    sys.combat.initiative = sys.combat.initiative ?? { base: 0 };
    sys.combat.strike = sys.combat.strike ?? { base: 0 };
    sys.combat.parry  = sys.combat.parry  ?? { base: 0 };
    sys.combat.dodge  = sys.combat.dodge  ?? { base: 0 };
    sys.movement = sys.movement ?? {
      land: { walkFPM: 60, runFPM: 180, sprintFPM: 240 },
      flyFPM: 0, swimFPM: 0
    };
    ctx.system = sys;
    return ctx;
  }
  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-action='open-item']").on("click", ev => {
      const id = ev.currentTarget.closest("[data-item-id]")?.dataset.itemId;
      this.actor?.items.get(id)?.sheet?.render(true);
    });
    const add = docs => this.actor?.createEmbeddedDocuments("Item", docs);
    html.find("[data-action='add-weapon']").on("click", ev => {
      const category = ev.currentTarget.dataset.category || "melee";
      add([{ name: category === "melee" ? "New Melee Weapon" : "New Gun",
        type: "weapon", system: { category, damage: "1d6", damageType: "SDC", range: 5, rof: 1, toHitMod: 0, notes: "" } }]);
    });
    html.find("[data-action='add-armor']").on("click", _ => {
      add([{ name: "New Armor", type: "armor", system: { type: "sdc", rating: 30, evasionMod: 0, notes: "" } }]);
    });
    html.find("[data-action='add-gear']").on("click", _ => {
      add([{ name: "New Gear", type: "gear", system: { notes: "" } }]);
    });
    html.find("[data-action='add-skill']").on("click", ev => {
      const category = ev.currentTarget.dataset.category || "secondary";
      add([{ name: "New Skill", type: "skill", system: { base: 30, perLevel: 5, mod: 0, category } }]);
    });
    html.find("[data-action='add-power']").on("click", ev => {
      const kind = ev.currentTarget.dataset.kind || "racial";
      add([{ name: kind==="spell" ? "New Spell" : (kind==="psionic" ? "New Psionic" : "New Ability"),
        type: "power", system: { kind, level: 1, cost: 10, stat: (kind==="psionic"?"ISP":"PPE"), castingTime: "1 action", notes: "" } }]);
    });
    const setSpeed = (selector, fpm) => {
      const fps = fpmToFps(fpm);
      const mph = fpsToMph(fps);
      html.find(`[data-speed='${selector}']`).text(`${fps.toFixed(1)} fps / ${mph.toFixed(1)} mph`);
    };
    const m = this.actor.system?.movement ?? {};
    setSpeed("land-walk",   m?.land?.walkFPM ?? 0);
    setSpeed("land-run",    m?.land?.runFPM ?? 0);
    setSpeed("land-sprint", m?.land?.sprintFPM ?? 0);
    setSpeed("fly",  this.actor.system?.movement?.flyFPM  ?? 0);
    setSpeed("swim", this.actor.system?.movement?.swimFPM ?? 0);
  }
}
class RiftsItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/rifts/templates/item-sheet.hbs",
      classes: ["rifts", "sheet", "item"],
      width: 700, height: 500,
      submitOnChange: true,
      closeOnSubmit: false
    });
  }
}
Hooks.once("init", () => {
  CONFIG.Combat.initiative = {
    formula: "1d20 + @system.combat.initiative.base + floor((@system.stats.PP||0)/2) - 5",
    decimals: 0
  };
});
Hooks.once("ready", () => {
  Actors.registerSheet("rifts", RiftsActorSheet, { types: ["character","npc"], makeDefault: true });
  Items.registerSheet("rifts", RiftsItemSheet, { makeDefault: true });
});