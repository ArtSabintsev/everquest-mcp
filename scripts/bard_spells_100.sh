#!/usr/bin/env bash
# bard_spells_100.sh - Parse EverQuest spell data for bard spells at level 100 or below.
#
# Reads spells_us.txt (^-delimited), filters bard spells (class ID 8, field index 43),
# groups by base spell name (stripping Rk. II / Rk. III suffixes), and outputs the
# highest-rank version of each song line available at levels 90-100.
#
# Usage: bash bard_spells_100.sh [path_to_spells_us.txt]

set -euo pipefail

SPELL_FILE="${1:-/Users/arthur/Library/Application Support/CrossOver/Bottles/EverQuest/drive_c/users/Public/Daybreak Game Company/Installed Games/EverQuest/spells_us.txt}"

if [[ ! -f "$SPELL_FILE" ]]; then
    echo "ERROR: Spell file not found: $SPELL_FILE" >&2
    exit 1
fi

awk -F'^' '
BEGIN {
    # Category names (from EQ spell data conventions)
    cat[6]   = "Haste/ATK"
    cat[11]  = "HP Buff"
    cat[13]  = "Mana Regen"
    cat[14]  = "HP/Mana"
    cat[16]  = "Resist Buff"
    cat[19]  = "Stat Buff"
    cat[21]  = "Charm"
    cat[22]  = "Mesmerize"
    cat[29]  = "Slow"
    cat[35]  = "DoT"
    cat[38]  = "DD Nuke"
    cat[41]  = "Stun"
    cat[44]  = "HP Regen"
    cat[58]  = "Damage"
    cat[63]  = "Dispel"
    cat[65]  = "Movement"
    cat[68]  = "Illusion"
    cat[75]  = "Summon"
    cat[80]  = "Cure"
    cat[81]  = "Fade"
    cat[88]  = "Pet"
    cat[89]  = "Combat Innate"
    cat[91]  = "Songs"
    cat[145] = "Aura"

    # Resist type names
    resist[0] = "Unresist"
    resist[1] = "Magic"
    resist[2] = "Fire"
    resist[3] = "Cold"
    resist[4] = "Poison"
    resist[5] = "Disease"
    resist[6] = "Chromatic"
    resist[7] = "Prismatic"
    resist[8] = "Physical"
    resist[9] = "Corruption"

    # Target type names (common values)
    tgt[3]  = "Group v1"
    tgt[5]  = "Single"
    tgt[6]  = "Self"
    tgt[8]  = "AE Target"
    tgt[14] = "PB AE"
    tgt[36] = "AE no NPC"
    tgt[40] = "Group v2"
    tgt[41] = "Group Song"
    tgt[43] = "Beam"
    tgt[46] = "Hat Trick"

    # Beneficial
    ben[0] = "Detrimental"
    ben[1] = "Beneficial"

    n = 0
}

{
    spell_id    = $1
    name        = $2
    cast_time   = $9    # ms
    recast_time = $11   # ms
    dur_formula = $12
    dur_value   = $13
    mana_cost   = $15
    beneficial  = $29
    resist_type = $30
    target_type = $31
    bard_level  = $44   # field index 43 (0-based) = $44 (1-based)
    category    = $88
    subcategory = $89

    # Filter: bard spell, level 1-100
    if (bard_level + 0 < 1 || bard_level + 0 > 100) next

    # Determine base name (strip rank suffix)
    base = name
    rank = 1
    if (match(name, / Rk\. III$/)) {
        base = substr(name, 1, RSTART - 1)
        rank = 3
    } else if (match(name, / Rk\. II$/)) {
        base = substr(name, 1, RSTART - 1)
        rank = 2
    }

    # For each base spell name, keep the highest rank version learnable at <= 100
    key = base
    if (!(key in best_rank) || rank > best_rank[key] || \
        (rank == best_rank[key] && (bard_level + 0) > (best_level[key] + 0))) {
        best_rank[key]       = rank
        best_level[key]      = bard_level + 0
        best_id[key]         = spell_id
        best_name[key]       = name
        best_mana[key]       = mana_cost + 0
        best_beneficial[key] = beneficial + 0
        best_dur[key]        = dur_value
        best_cast[key]       = cast_time + 0
        best_recast[key]     = recast_time + 0
        best_resist[key]     = resist_type + 0
        best_target[key]     = target_type + 0
        best_cat[key]        = category + 0
    }
}

END {
    # Print header
    printf "%-7s  %-45s  %5s  %5s  %-13s  %-12s  %6s  %5s  %-10s  %-12s\n", \
        "ID", "SPELL NAME", "LVL", "MANA", "TYPE", "CATEGORY", "CAST", "DUR", "RESIST", "TARGET"
    printf "%-7s  %-45s  %5s  %5s  %-13s  %-12s  %6s  %5s  %-10s  %-12s\n", \
        "-------", "---------------------------------------------", "-----", "-----", \
        "-------------", "------------", "------", "-----", "----------", "------------"

    # Collect keys for spells at level 90-100 and sort
    n = 0
    for (key in best_level) {
        if (best_level[key] >= 90 && best_level[key] <= 100) {
            n++
            keys[n] = key
            # Sort key: descending level (200 - level), then ascending name
            sort_key[n] = sprintf("%03d|%s", 200 - best_level[key], best_name[key])
        }
    }

    # Insertion sort
    for (i = 2; i <= n; i++) {
        tmp_key  = keys[i]
        tmp_sort = sort_key[i]
        j = i - 1
        while (j >= 1 && sort_key[j] > tmp_sort) {
            keys[j+1]     = keys[j]
            sort_key[j+1] = sort_key[j]
            j--
        }
        keys[j+1]     = tmp_key
        sort_key[j+1] = tmp_sort
    }

    # Print each spell
    for (i = 1; i <= n; i++) {
        key = keys[i]

        b = best_beneficial[key]
        b_str = (b in ben) ? ben[b] : ("?" b)

        c = best_cat[key]
        c_str = (c in cat) ? cat[c] : ("cat:" c)

        r = best_resist[key]
        r_str = (r in resist) ? resist[r] : ("res:" r)

        t = best_target[key]
        t_str = (t in tgt) ? tgt[t] : ("tgt:" t)

        cast_sec = best_cast[key] / 1000

        printf "%-7s  %-45s  %5d  %5d  %-13s  %-12s  %5.1fs  %5s  %-10s  %-12s\n", \
            best_id[key], best_name[key], best_level[key], best_mana[key], \
            b_str, c_str, cast_sec, best_dur[key], r_str, t_str
    }

    printf "\nTotal unique song lines (level 90-100, best rank): %d\n", n

    # --- Summary: group by category ---
    printf "\n=== SONGS BY CATEGORY ===\n"
    delete cat_count
    delete cat_spells
    for (i = 1; i <= n; i++) {
        key = keys[i]
        c = best_cat[key]
        c_str = (c in cat) ? cat[c] : ("cat:" c)
        cat_count[c_str]++
        cat_spells[c_str] = cat_spells[c_str] (cat_spells[c_str] ? "\n    " : "") \
            best_name[key] " (L" best_level[key] ", " (best_beneficial[key] ? "Ben" : "Det") ")"
    }

    # Print categories
    for (c_str in cat_count) {
        printf "\n  [%s] (%d song lines)\n    %s\n", c_str, cat_count[c_str], cat_spells[c_str]
    }

    # --- Suggested twist lineup ---
    printf "\n=== SUGGESTED SOLO/MOLO TWIST LINEUP (Level 100) ===\n"
    printf "Bards can maintain ~5 songs via /melody.\n"
    printf "Swap songs in/out based on situation.\n\n"
    printf "  SLOT 1 - Melee DPS:       Haste/ATK/Overhaste song\n"
    printf "  SLOT 2 - Survivability:    HP/AC buff or regen song\n"
    printf "  SLOT 3 - Healing:          HP regen / crescendo\n"
    printf "  SLOT 4 - Mana Regen:       For merc healer sustain\n"
    printf "  SLOT 5 - Damage:           DoT or damage proc song\n"
    printf "  SWAP   - Slow:             When pulling / named mobs\n"
    printf "  SWAP   - Mezz:             Crowd control\n"
    printf "  SWAP   - Run speed:        Travel / pulling\n"
    printf "  SWAP   - Resist debuff:    Raid / group content\n"
    printf "\nRefer to the full list above to pick the best specific songs.\n"
}
' "$SPELL_FILE"
